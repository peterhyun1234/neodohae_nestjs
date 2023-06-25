import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  // CREATE
  async create(user: Partial<User>): Promise<User> {
    return this.userModel.create(user);
  }

  // READ
  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findByPk(id);
  }

  async findOneByEmailAndProvider(
    email: string,
    provider: string,
  ): Promise<User> {
    return this.userModel.findOne({ where: { email, provider } });
  }

  // UPDATE
  async update(id: string, user: Partial<User>): Promise<number> {
    const [affectedCount] = await this.userModel.update(user, {
      where: { id },
    });
    return affectedCount;
  }

  // DELETE
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
