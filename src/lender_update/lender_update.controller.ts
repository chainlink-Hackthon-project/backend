import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { LenderUpdateService } from './lender_update.service';

@Controller('lender-update')
export class LenderUpdateController {
  constructor(private readonly lenderUpdateService: LenderUpdateService) {}

  
  
    @Post('/update-lending-details')
    async updateLendingDetails(@Body() LendingData){
      try {
  
        console.log("this is the lending" , LendingData);
        
        const result = await this.lenderUpdateService.updateLendingDetails(LendingData);
  
        if(!result){
          throw new Error("could not update the user");
        }
  
        return result;
        
      } catch (error) {
        console.log("getting error in updating the user lending status details" , error);
  
        throw new HttpException(
                {
                  message : "getting error in updating user lending details", 
                  error : error
                }, 
                HttpStatus.INTERNAL_SERVER_ERROR
              )
        
        
      }
    }
  
  
  
  // can use indexer here also , to take dataa from event
    @Post('/withdrawal')
    async withdrawal(@Body() withdrawal_info){
      try {
  
        console.log("this is the repayment info" , withdrawal_info);
        
        const result = await this.lenderUpdateService.withdrawal(withdrawal_info);
  
        if(!result){
          throw new Error("could not update the lending status");
        }
  
        return result;
        
      } catch (error) {
        console.log("getting error in updating the user lending details" , error);
  
        throw new HttpException(
                {
                  message : "getting error in updating user lending details", 
                  error : error
                }, 
                HttpStatus.INTERNAL_SERVER_ERROR
              )
        
        
      }
    }
}
