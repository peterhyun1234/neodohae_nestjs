import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Schedule } from './schedule.model';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedule)
    private readonly scheduleModel: typeof Schedule,
  ) {}

  async findAll(): Promise<Schedule[]> {
    return this.scheduleModel.findAll();
  }

  async findOne(id: string): Promise<Schedule> {
    return this.scheduleModel.findByPk(id);
  }

  async create(schedule: Partial<Schedule>): Promise<Schedule> {
    return this.scheduleModel.create(schedule);
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
