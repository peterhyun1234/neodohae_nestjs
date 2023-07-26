import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './notification.model';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification)
    private notificationModel: typeof Notification,
  ) {}

  async create(notification: Partial<Notification>): Promise<Notification> {
    try {
      this.logger.log(`Creating notification: ${JSON.stringify(notification)}`);
      return this.notificationModel.create(notification);
    } catch (error) {
      this.logger.error(
        `Failed to create notification: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAllByUserId(userId: number): Promise<Notification[]> {
    try {
      this.logger.log(`Finding all notifications by userId: ${userId}`);
      return this.notificationModel.findAll({
        where: { userId },
        order: [
          ['isRead', 'ASC'],
          ['createdAt', 'DESC'],
        ],
      });
    } catch (error) {
      this.logger.error(
        `Failed to find all notifications by userId ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: number): Promise<Notification> {
    try {
      this.logger.log(`Finding notification with id: ${id}`);
      return this.notificationModel.findByPk(id);
    } catch (error) {
      this.logger.error(
        `Failed to find notification with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(
    id: number,
    notification: Partial<Notification>,
  ): Promise<number> {
    try {
      this.logger.log(`Updating notification with id: ${id}`);
      const [affectedCount] = await this.notificationModel.update(
        notification,
        {
          where: { id },
        },
      );
      this.logger.log(`Updated notification count: ${affectedCount}`);
      return affectedCount;
    } catch (error) {
      this.logger.error(
        `Failed to update notification with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async markAllAsRead(userId: number): Promise<void> {
    try {
      this.logger.log(
        `Marking all notifications as read for userId: ${userId}`,
      );
      await this.notificationModel.update(
        { isRead: true },
        { where: { userId } },
      );
    } catch (error) {
      this.logger.error(
        `Failed to mark all notifications as read for userId ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      this.logger.log(`Removing notification with id: ${id}`);
      const notification = await this.findOne(id);
      await notification.destroy();
    } catch (error) {
      this.logger.error(
        `Failed to remove notification with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
