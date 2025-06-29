import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../model/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BorrowersUpdateService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async updateBorrowingDetails(loanDetails) {
    console.log('thisis the user', loanDetails, loanDetails?.userAddress);

    const user = await this.userRepo.findOne({
      where: { accountAddress: loanDetails?.userAddress?.toLowerCase() },
    });

    if (!user) {
      throw new Error('no user found , something is wrong');
    }

    user.userStatus = 1;
    user.borrowedAmount = String(loanDetails?.usdtAmount);
    user.loanLockId = String(loanDetails?.lockId);
    user.startDate = new Date();

    await this.userRepo.save(user);

    return {
      success: true,
    };
  }

  async updateRepayment(repaymentData) {
    console.log('this is the user', repaymentData, repaymentData?.userAddress);

    if (!repaymentData?.userAddress) {
      throw new Error('userAddress is missing');
    }

    const user = await this.userRepo.findOne({
      where: { accountAddress: repaymentData.userAddress.toLowerCase() },
    });

    if (!user) {
      throw new Error('no user found, something is wrong');
    }

    const borrowed = Number(user.borrowedAmount || 0);
    const paid = Number(repaymentData?.usdtAmount || 0);
    const remaining_amount = borrowed - paid;

    console.log('this is the balance', remaining_amount);

    if (remaining_amount > 0) {
      user.borrowedAmount = String(remaining_amount);
    } else {
      user.borrowedAmount = '0';
      user.userStatus = 0;
    }

    await this.userRepo.save(user);

    return {
      success: true,
    };
  }
}
