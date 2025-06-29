import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndexerModule } from './indexer/indexer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './core/config.service';
import { UserModule } from './user/user.module';
import { BorrowersUpdateModule } from './borrowers_update/borrowers_update.module';
import { LenderUpdateModule } from './lender_update/lender_update.module';

@Module({
  imports: [IndexerModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UserModule,
    BorrowersUpdateModule,
    LenderUpdateModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
