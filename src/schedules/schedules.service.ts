import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Schedule } from './schedule.model';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedule)
    private readonly scheduleModel: typeof Schedule,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<Schedule[]> {
    return this.scheduleModel.findAll();
  }

  async findOne(id: string): Promise<Schedule> {
    return this.scheduleModel.findByPk(id);
  }

  async create(schedule: Partial<Schedule>): Promise<Schedule> {
    const creadSchedule = await this.scheduleModel.create(schedule);

    const userId = creadSchedule.userId;
    const user = await this.usersService.findOne(userId);
    const roomId = user.roomId;

    const roomUsers = await this.usersService.findAllByRoomId(roomId);
    const userIds = roomUsers.map((user) => user.id);
    userIds.forEach((id) => {
      if (id === userId) return;
      const payload = {
        title: `새로운 스케줄: "${creadSchedule.title}"`,
        body: `${user.username}님이 스케줄을 추가했습니다.`,
      };
      this.subscriptionsService.sendNotificationToUser(id, payload);
    });

    return creadSchedule;
  }

  async update(id: string, schedule: Partial<Schedule>): Promise<number> {
    const [affectedCount] = await this.scheduleModel.update(schedule, {
      where: { id },
    });
    return affectedCount;
  }

  async remove(id: string): Promise<void> {
    const schedule = await this.findOne(id);
    await schedule.destroy();
  }
}
