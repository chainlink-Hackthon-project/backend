import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { BorrowersUpdateService } from './borrowers_update.service';

@Controller('borrowers-update')
export class BorrowersUpdateController {
  constructor(private readonly borrowersUpdateService: BorrowersUpdateService) {}


  @Post('/update-borrowing-details')
  async updateBorrowingDetails(@Body() loanData){
    try {

      console.log("this is the loandata" , loanData);
      
      const result = await this.borrowersUpdateService.updateBorrowingDetails(loanData);

      if(!result){
        throw new Error("could not update the user");
      }

      return result;
      
    } catch (error) {
      console.log("getting error in updating the user loan details" , error);

      throw new HttpException(
              {
                message : "getting error in updating user loan details", 
                error : error
              }, 
              HttpStatus.INTERNAL_SERVER_ERROR
            )
      
      
    }
  }



// can use indexer here also , to take dataa from event
  @Post('/repayment')
  async updateBorrowingRepayment(@Body() repaymentInfo){
    try {

      console.log("this is the repayment info" , repaymentInfo);
      
      const result = await this.borrowersUpdateService.updateRepayment(repaymentInfo);

      if(!result){
        throw new Error("could not update the user");
      }

      return result;
      
    } catch (error) {
      console.log("getting error in updating the user loan details" , error);

      throw new HttpException(
              {
                message : "getting error in updating user loan details", 
                error : error
              }, 
              HttpStatus.INTERNAL_SERVER_ERROR
            )
      
      
    }
  }
}
