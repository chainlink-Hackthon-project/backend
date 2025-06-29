import { Module } from '@nestjs/common';
import { LenderUpdateService } from './lender_update.service';
import { LenderUpdateController } from './lender_update.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../model/User.entity';

@Module({
  controllers: [LenderUpdateController],
  providers: [LenderUpdateService],
  imports :[TypeOrmModule.forFeature([User])]
})
export class LenderUpdateModule {}
