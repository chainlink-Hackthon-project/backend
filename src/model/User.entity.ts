import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'account_address' , unique : true })
  accountAddress: string;

  //  0= borrower , 1= lender
  @Column({ name: 'status', default: 0 })
  userType: number;

  
  // user status , whether user has any loan or this is a new use
  // 0= new , 1 = running loan , 2 = lended money for interest
  @Column({ name: 'user_status', default: 0 })
  userStatus: number;

  // money lended to gain interest in usdt
  @Column({ name: 'lended_amount', default: 0 })
  lendedAmount: string;

//  collateral given in eth
  @Column({ name: 'collateral_amount', nullable: true })
  collateralAmount: string;

  // loan taken on that collateral eth
  @Column({ name: 'borrowed_amount', nullable: true })
  borrowedAmount: string;

  @Column({ name: 'interest_rate', nullable: true })
  interestRate: string;

  // loan start date / money lending start date
  @Column({ name: 'start_date', nullable: true })
  startDate: Date;

  // for collateral
  @Column({ name: 'liquidation_price', nullable: true })
  liquidationPrice: string;

  // this is the lock id of the loan on the avalanche chain
  @Column({ name: 'loan_lock_id', nullable: true })
  loanLockId: string;
}
