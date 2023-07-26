import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Schedule } from './schedule.model';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SchedulesService {
  private readonly logger = new Logger(SchedulesService.name);

  constructor(
    @InjectModel(Schedule)
    private readonly scheduleModel: typeof Schedule,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<Schedule[]> {
    try {
      this.logger.log('Finding all schedules');
      return this.scheduleModel.findAll();
    } catch (error) {
      this.logger.error(
        `Failed to find all schedules: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<Schedule> {
    try {
      this.logger.log(`Finding schedule with id: ${id}`);
      return this.scheduleModel.findByPk(id);
    } catch (error) {
      this.logger.error(
        `Failed to find schedule with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async create(schedule: Partial<Schedule>): Promise<Schedule> {
    try {
      this.logger.log(`Creating schedule: ${JSON.stringify(schedule)}`);
      const createdSchedule = await this.scheduleModel.create(schedule);

      const userId = createdSchedule.userId;
      const user = await this.usersService.findOne(userId);
      const roomId = user.roomId;

      const roomUsers = await this.usersService.findAllByRoomId(roomId);
      const userIds = roomUsers.map((user) => user.id);
      userIds.forEach((id) => {
        if (id === userId) return;
        const payload = {
          title: `새로운 스케줄: "${createdSchedule.title}"`,
          body: `${user.username}님이 스케줄을 추가했습니다.`,
        };
        this.subscriptionsService.sendNotificationToUser(id, payload);
      });

      this.logger.log(`Created schedule: ${JSON.stringify(createdSchedule)}`);
      return createdSchedule;
    } catch (error) {
      this.logger.error(
        `Failed to create schedule: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: string, schedule: Partial<Schedule>): Promise<number> {
    try {
      this.logger.log(`Updating schedule with id: ${id}`);
      const [affectedCount] = await this.scheduleModel.update(schedule, {
        where: { id },
      });
      this.logger.log(`Updated schedule count: ${affectedCount}`);
      return affectedCount;
    } catch (error) {
      this.logger.error(
        `Failed to update schedule with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.log(`Removing schedule with id: ${id}`);
      const schedule = await this.findOne(id);
      await schedule.destroy();
      this.logger.log(`Removed schedule with id: ${id}`);
    } catch (error) {
      this.logger.error(
        `Failed to remove schedule with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
