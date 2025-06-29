import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../model/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {}

  async create_find_user(userAddress: string, userType: string): Promise<User> {
  const normalizedAddress = userAddress.toLowerCase();

  let user = await this.userRepo.findOne({
    where: { accountAddress: normalizedAddress },
  });

  if (!user) {
    const newUser = new User();
    newUser.accountAddress = normalizedAddress;
    newUser.userType = userType === 'borrower' ? 0 : 1;

    try {
      return await this.userRepo.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        // Duplicate key error: fetch existing user
        const user = await this.userRepo.findOne({
          where: { accountAddress: normalizedAddress },
        });
        return user!;
      }
      throw error;
    }
  }

  return user;
}

}
