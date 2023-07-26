import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    this.logger.log(`Creating user: ${JSON.stringify(user)}`);
    try {
      const newUser = await this.userModel.create(user);
      this.logger.log(`Created user: ${JSON.stringify(newUser)}`);
      return newUser;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    this.logger.log('Finding all users');
    return this.userModel.findAll();
  }

  async findOne(id: string | number): Promise<User> {
    this.logger.log(`Finding user with id: ${id}`);
    const user = await this.userModel.findByPk(id);
    if (!user) {
      this.logger.error(`User not found with id: ${id}`);
    }
    return user;
  }

  async findOneByEmailAndProvider(
    email: string,
    provider: string,
  ): Promise<User> {
    this.logger.log(
      `Finding user with email: ${email} and provider: ${provider}`,
    );
    return this.userModel.findOne({ where: { email, provider } });
  }

  async findAllByRoomId(roomId: number): Promise<User[]> {
    this.logger.log(`Finding all users by roomId: ${roomId}`);
    return this.userModel.findAll({
      where: { roomId: roomId },
    });
  }

  async update(id: string, user: Partial<User>): Promise<number> {
    this.logger.log(`Updating user with id: ${id}`);
    try {
      const [affectedCount] = await this.userModel.update(user, {
        where: { id },
        individualHooks: true,
      });
      if (affectedCount > 0 && user.roomId) {
        const roomUsers = await this.findAllByRoomId(user.roomId);
        const updatedUser = await this.findOne(id);
        const userIds = roomUsers.map((user) => user.id);
        userIds.forEach((id) => {
          if (id === Number(updatedUser.id)) return;
          const payload = {
            title: '새로운 룸메이트',
            body: `${updatedUser.username}님이 룸메이트가 되었습니다.`,
          };
          this.subscriptionsService.sendNotificationToUser(id, payload);
        });
      }
      return affectedCount;
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing user with id: ${id}`);
    const user = await this.findOne(id);
    await user.destroy();
  }

  async leaveRoom(userId: string, roomId: string): Promise<User> {
    this.logger.log(`User with id: ${userId} leaving room with id: ${roomId}`);
    const user = await this.findOne(userId);
    if (!user) {
      this.logger.error(`User not found with id: ${userId}`);
      throw new NotFoundException('User not found');
    }
    if (user.roomId !== Number(roomId)) {
      this.logger.error(
        `User with id: ${userId} is not in the room with id: ${roomId}`,
      );
      throw new BadRequestException('User is not in the specified room');
    }
    user.roomId = null;
    await user.save();
    return user;
  }
}
