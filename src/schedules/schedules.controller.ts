import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SchedulesService } from './schedules.service';
import { Schedule } from './schedule.model';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: '새 Schedule 생성' })
  @ApiBody({ type: Schedule, description: 'Schedule 정보' })
  @ApiResponse({ status: 201, description: 'Schedule이 생성되었습니다.' })
  create(@Body() schedule: Partial<Schedule>) {
    return this.schedulesService.create(schedule);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: '모든 Schedule 조회' })
  @ApiResponse({
    status: 200,
    description: 'Schedule 목록 반환',
    type: [Schedule],
  })
  findAll() {
    return this.schedulesService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({ summary: 'ID로 Schedule 조회' })
  @ApiParam({ name: 'id', required: true, description: '조회할 Schedule의 ID' })
  @ApiResponse({
    status: 200,
    description: '해당 ID의 Schedule 정보 반환',
    type: Schedule,
  })
  findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @ApiOperation({ summary: 'Schedule 정보 수정' })
  @ApiParam({ name: 'id', required: true, description: '수정할 Schedule의 ID' })
  @ApiBody({ type: Schedule, description: '수정할 Schedule 정보' })
  @ApiResponse({
    status: 200,
    description: 'Schedule 정보 수정 완료',
    type: Schedule,
  })
  update(@Param('id') id: string, @Body() schedule: Partial<Schedule>) {
    return this.schedulesService.update(id, schedule);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Schedule 삭제' })
  @ApiParam({ name: 'id', required: true, description: '삭제할 Schedule의 ID' })
  @ApiResponse({
    status: 200,
    description: 'Schedule 삭제 완료',
    type: Schedule,
  })
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(id);
  }
}
