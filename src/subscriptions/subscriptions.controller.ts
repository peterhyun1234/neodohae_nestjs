import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './subscription.model';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('schedusubscriptionsles')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: '새 Subscription 생성' })
  @ApiBody({ type: Subscription, description: 'Subscription 정보' })
  @ApiResponse({ status: 201, description: 'Subscription이 생성되었습니다.' })
  create(@Body() data: { userId: number; subscription: any }) {
    return this.subscriptionsService.createSubscription(
      data.userId,
      data.subscription,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':endpoint/notification')
  @ApiOperation({ summary: 'Notification 전송' })
  @ApiParam({
    name: 'endpoint',
    required: true,
    description: 'Notification을 전송할 Subscription의 endpoint',
  })
  sendNotification(@Param('endpoint') endpoint: string, @Body() payload: any) {
    return this.subscriptionsService.sendNotification(endpoint, payload);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('user/:userId/notification')
  @ApiOperation({ summary: 'Notification 전송' })
  @ApiParam({
    name: 'userId',
    required: true,
    description: 'Notification을 전송할 Subscription의 userId',
  })
  sendNotificationToUser(
    @Param('userId') userId: number,
    @Body() payload: any,
  ) {
    return this.subscriptionsService.sendNotificationToUser(userId, payload);
  }
}
