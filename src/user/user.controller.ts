import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('getUserDetails')
  async GetUserDetails(@Body() body :{userAddress : number , userType : string}) {
    try {

          console.log("i am called" , body?.userAddress , body?.userType);
      const userDetails = await this.userService.create_find_user(String(body?.userAddress) , body?.userType);
  
      

      if(!userDetails){
        throw new Error("some error in finding/ creating user");
      }

      return userDetails;

    } catch (error) {
      console.log(' getting error fetching user' , error);
      throw new HttpException(
        {
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
