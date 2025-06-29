import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { IndexerService } from './indexer.service';

@Controller('indexer')
export class IndexerController {
  constructor(private readonly indexerService: IndexerService) {}



  @Get('thisTxn')
  async CatchThisEvent( @Param() txnHash : string){

    console.log("this is the transaction hash" , txnHash);

    try {

      const txnResult = await this.indexerService.indexthisTxn();

      if(!txnResult){
        throw new Error("getting error in pollling chain");
      }

      console.log("this is the txn result =>" , txnResult);
      
      return txnResult
      
    } catch (error) {

      console.log("we are getting error is polling chain for this txn hash = > "  , error );
      
      throw new HttpException(
        {
          message : "getting error in polling", 
          error : error
        }, 
        HttpStatus.INTERNAL_SERVER_ERROR
      )
      
      
    }
    

  }

  @Post('call')
  async callBackend(@Body() data ){
    console.log("I am called" , data);
    

    const result = this.indexerService.callContractFunction(data?.user_address, data?.lockId, data?.amount);

  }
}
