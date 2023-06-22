import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { Schedule } from './schedule.model';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  findAll(): Promise<Schedule[]> {
    return this.schedulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Schedule> {
    return this.schedulesService.findOne(id);
  }

  @Post()
  create(@Body() schedule: Partial<Schedule>): Promise<Schedule> {
    return this.schedulesService.create(schedule);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() schedule: Partial<Schedule>,
  ): Promise<number> {
    return this.schedulesService.update(id, schedule);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.schedulesService.remove(id);
  }
}
