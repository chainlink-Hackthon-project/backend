import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../model/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LenderUpdateService {

    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
      ) {}
    
      async updateLendingDetails(LendingData) {
        console.log('thisis the user', LendingData, LendingData?.userAddress);
    
        const user = await this.userRepo.findOne({
          where: { accountAddress: LendingData?.userAddress?.toLowerCase() },
        });
    
        if (!user) {
          throw new Error('no user found , something is wrong');
        }
    
        user.userStatus = 2;
        user.lendedAmount = String(LendingData?.usdtAmount);
        user.startDate = new Date();
    
        await this.userRepo.save(user);
    
        return {
          success: true,
        };
      }
    
      async withdrawal(withdrawal_info) {
        console.log('this is the user', withdrawal_info, withdrawal_info?.userAddress);
    
        if (!withdrawal_info?.userAddress) {
          throw new Error('userAddress is missing');
        }
    
        const user = await this.userRepo.findOne({
          where: { accountAddress: withdrawal_info?.userAddress?.toLowerCase() },
        });
    
        if (!user) {
          throw new Error('no user found, something is wrong');
        }

    
        // await this.userRepo.save(user);

        user.lendedAmount = '';
        await this.userRepo.save(user);


    
        return {
          success: true,
        };
      }
}
