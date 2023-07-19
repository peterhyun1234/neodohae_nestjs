import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subscription } from './subscription.model';
import { NotificationsService } from 'src/notifications/notifications.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const webPush = require('web-push');

webPush.setVapidDetails(
  'mailto:peterhyun1234@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscription)
    private subscriptionModel: typeof Subscription,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createSubscription(
    userId: number,
    subscription: any,
  ): Promise<Subscription | number> {
    const { endpoint } = subscription;

    const existingSubscription = await this.subscriptionModel.findByPk(
      endpoint,
    );
    if (existingSubscription) {
      const [affectedCount] = await this.subscriptionModel.update(
        { ...subscription, userId },
        { where: { endpoint } },
      );
      return affectedCount;
    } else {
      return this.subscriptionModel.create({ ...subscription, userId });
    }
  }

  async sendNotification(endpoint: string, payload: any) {
    const subscription = await this.subscriptionModel.findByPk(endpoint);
    if (!subscription) throw new Error('Subscription not found');

    return webPush.sendNotification(subscription, JSON.stringify(payload));
  }

  async sendNotificationToUser(
    userId: number,
    payload: any,
    dontSave?: boolean,
  ) {
    const subscriptions = await this.subscriptionModel.findAll({
      where: { userId },
    });
    if (!subscriptions) throw new Error('Subscription not found');

    if (!dontSave) {
      this.notificationsService.create({
        userId: userId,
        title: payload.title,
        body: payload.body,
      });
    }
    return Promise.all(
      subscriptions.map((subscription) =>
        webPush.sendNotification(subscription, JSON.stringify(payload)),
      ),
    );
  }
}
