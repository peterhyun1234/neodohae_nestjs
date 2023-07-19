import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { Notification } from './notification.model';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: '알림 생성' })
  @ApiResponse({
    status: 201,
    description: '알림이 성공적으로 생성되었습니다.',
  })
  create(@Body() notification: Partial<Notification>) {
    return this.notificationsService.create(notification);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/:userId')
  @ApiOperation({ summary: '유저의 알림 조회' })
  @ApiResponse({
    status: 200,
    description: '해당 유저의 알림 목록이 반환되었습니다.',
  })
  findAllByUserId(@Param('userId') userId: number) {
    return this.notificationsService.findAllByUserId(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({ summary: '알림 조회' })
  @ApiResponse({ status: 200, description: '해당 id의 알림이 반환되었습니다.' })
  findOne(@Param('id') id: number) {
    return this.notificationsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @ApiOperation({ summary: '알림 수정' })
  @ApiResponse({
    status: 200,
    description: '알림이 성공적으로 수정되었습니다.',
  })
  update(@Param('id') id: number, @Body() notification: Partial<Notification>) {
    return this.notificationsService.update(id, notification);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: '알림 삭제' })
  @ApiResponse({
    status: 200,
    description: '알림이 성공적으로 삭제되었습니다.',
  })
  remove(@Param('id') id: number) {
    return this.notificationsService.remove(id);
  }
}
