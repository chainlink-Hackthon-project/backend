import { Module } from '@nestjs/common';
import { IndexerService } from './indexer.service';
import { IndexerController } from './indexer.controller';
import { User } from '../model/User.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [IndexerController],
  providers: [IndexerService],
  imports :[TypeOrmModule.forFeature([User])]
})
export class IndexerModule {}
