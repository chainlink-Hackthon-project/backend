import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../model/User.entity';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports :[TypeOrmModule.forFeature([User])]
})
export class UserModule {}
