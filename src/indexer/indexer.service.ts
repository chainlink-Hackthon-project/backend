import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers } from 'ethers';
import { Repository } from 'typeorm';
import { User } from '../model/User.entity';

@Injectable()
export class IndexerService {
  maxIndexingTime: any;

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  // when this service is called , txn is confirmed and we will polling for current block -5 to current block+20
  async indexthisTxn() {
    const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_API);

    let LatestBlock = await provider.getBlockNumber();

    // we will poll till this block
    const lastBlockTocheck = LatestBlock + 20;

    let logs;

    // we will start checking from current block -5
    let lastCheckedBlock = LatestBlock - 6;

    // we will max check 20 block to find the logs , else there is some error
    while (lastCheckedBlock < lastBlockTocheck) {
      let currentBlock = await provider.getBlockNumber();

      // if no new block is created , we will wait for 4 sec and then again check for new block
      if (lastCheckedBlock >= currentBlock) {
        console.log('No new block. Waiting 4 seconds...');
        await new Promise((resolve) => setTimeout(resolve, 4000));
        continue;
      }

      // Get logs for the lockedEther event
      logs = await provider.getLogs({
        address:
          process.env.ETH_CONTRACT_ADDRESS ||
          '0x15dAD7aA6A7A44D68531C8f7F82326b26a02f606', //todo , contract address
        fromBlock: lastCheckedBlock + 1,
        toBlock: currentBlock,
        topics: [`${process.env.LOCK_EVENT_HASH_SIGNATURE}`], // event hash signature
      });

      // if we found the log , we will exit the loop
      if (logs.length > 0) {
        console.log(`Found ${logs} events`);
        break;
      }

      // updating the last checked block
      lastCheckedBlock = currentBlock;
    }

    if (!logs.length) {
      throw new Error('no transaction found');
    }

    // going through logs and finding our txn details
    for (const log of logs) {
      try {
        // Extract event data
        const eventData = await this.parseLogData(log);

        console.log('Found target event! Event Data:', {
          ...eventData,
          blockNumber: log?.blockNumber,
          transactionHash: log?.transactionHash,
        });

        const user = await this.userRepo.findOne({
          where: { accountAddress: String(eventData?.user_address) },
        });

        console.log(
          'this is the useraddress',
          eventData?.user_address.toLowerCase(),
          typeof eventData?.user_address,
        );

        console.log('this is the user', user);

        if (!user) {
          throw new Error('no user found , fake call');
        }

        // saving data in the DB

        // since collateral is recieved in our contract , this user is a borrower
        user.userType = 0;
        // collateral locked(eth/wai) in contract
        user.collateralAmount = eventData?.amount;

        // saving data in the database
        await this.userRepo.save(user);

        // CALLING AVALANCHE CONTRACT FOR SENDING COLLATERAL RECIEVED CONFIRMATION

        // Call contract function with extracted data
        const result = await this.callContractFunction(
          eventData.user_address,
          eventData.lockId,
          eventData.amount,
        );

        if (result) {
          console.log(
            `✅ Successfully processed transaction: ${log.transactionHash}`,
          );

          // Found our target transaction - exit immediately
          console.log(`Target transaction found`);

          return {
            success: true,
            lockId : eventData.lockId
          };
        } else {
          console.log(
            'some error in sending collateral confirmation to the backend',
          );
          return {
            success: false,
            lockId : null
          };
        }
      } catch (error) {
        console.error(`Error processing log ${log.transactionHash}:`, error);
        // If this was our target transaction and it failed, we should return the error

        return {
          success: false,
          lockId : null
        };
      }
    }
  }

  // this function will get the hashed logs and give the real readable data

  async parseLogData(log) {
    try {
      const lockId = log.topics[1]; // bytes32
      const user_address = '0x' + log.topics[2].slice(26); // address (last 20 bytes of the 32-byte topic)
      const messageId = log.topics[3]; // bytes32

      const amount = BigInt(log.data).toString(); // uint256 from data

      console.log(
        'this is the event data',
        user_address,
        typeof user_address,
        lockId,
        typeof lockId,
      );

      return {
        lockId,
        user_address,
        amount,
        messageId,
      };
    } catch (error) {
      console.error('Error parsing log data:', error);
      throw error;
    }
  }

  // Function to call your contract with the extracted data
  async callContractFunction(user_address : string, lockId : string, amount  :string ) {
    try {
      const provider = new ethers.JsonRpcProvider(
        process.env.AVALANCHE_RPC_API,
      );

      const wallet = new ethers.Wallet(
        process.env.SIGNER_PRIVATE_KEY!,
        provider,
      );

      // Convert inputs to proper types
      const userAddress = ethers.getAddress(user_address);
      const lockIdBytes32 = ethers.zeroPadValue(lockId, 32);
      const amountWei = ethers.getBigInt(amount);

      // Avalanche contract ABI - Updated to match the actual function signature
      const contractABI = [
        `function backendConfirmation(
        address user,
        bytes32 lockId,
        uint256 amountWei
    ) external`,
      ];

      // avalanche contract instance
      const contract = new ethers.Contract(
        process.env.AVALANCHE_CONTRACT_ADDRESS!,
        contractABI,
        wallet,
      );

      console.log('Calling backend_confirmation with:', {
        userAddress,
        lockIdBytes32,
        amountWei,
        eth_contract_address: process.env.ETH_CONTRACT_ADDRESS,
      });
      // console.log("Contract functions:", Object.keys(contract.functions));

      // Call the contract function
      const tx = await contract.backendConfirmation(
        userAddress,
        lockIdBytes32,
        amountWei,
        {
          gasLimit: 700000,
          gasPrice: await provider.getFeeData().then((fees) => fees.gasPrice),
        },
      );

      console.log(`Transaction sent to Avalanche contract: ${tx.hash}`);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);

      return receipt;
    } catch (error) {
      console.error('Error calling contract function:', error);

      // Log more specific error information
      if (error.code === 'CALL_EXCEPTION') {
        console.error(
          'Contract call failed - check function signature and parameters',
        );
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        console.error('Insufficient funds for transaction');
      } else if (error.code === 'NONCE_EXPIRED') {
        console.error('Nonce expired - transaction may have been replaced');
      }

      throw error;
    }
  }
}
