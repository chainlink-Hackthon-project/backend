import { Module } from '@nestjs/common';
import { BorrowersUpdateService } from './borrowers_update.service';
import { BorrowersUpdateController } from './borrowers_update.controller';
import { User } from '../model/User.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [BorrowersUpdateController],
  providers: [BorrowersUpdateService],
  imports :[TypeOrmModule.forFeature([User])]
})
export class BorrowersUpdateModule {}
