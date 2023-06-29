import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    return this.userModel.create(user);
  }

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

  async findAllByRoomId(roomId: number): Promise<User[]> {
    return this.userModel.findAll({
      where: { roomId: roomId },
    });
  }

  async update(id: string, user: Partial<User>): Promise<number> {
    const [affectedCount] = await this.userModel.update(user, {
      where: { id },
      individualHooks: true,
    });
    return affectedCount;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }

  async leaveRoom(userId: string, roomId: string): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.roomId !== Number(roomId)) {
      throw new BadRequestException('User is not in the specified room');
    }
    user.roomId = null;
    await user.save();
    return user;
  }
}
