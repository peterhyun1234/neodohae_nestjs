import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './notification.model';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification)
    private notificationModel: typeof Notification,
  ) {}

  async create(notification: Partial<Notification>): Promise<Notification> {
    return this.notificationModel.create(notification);
  }

  async findAllByUserId(userId: number): Promise<Notification[]> {
    return this.notificationModel.findAll({
      where: { userId },
      order: [
        ['isRead', 'ASC'],
        ['createdAt', 'DESC'],
      ],
    });
  }

  async findOne(id: number): Promise<Notification> {
    return this.notificationModel.findByPk(id);
  }

  async update(
    id: number,
    notification: Partial<Notification>,
  ): Promise<number> {
    const [affectedCount] = await this.notificationModel.update(notification, {
      where: { id },
    });
    return affectedCount;
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationModel.update(
      { isRead: true },
      { where: { userId } },
    );
  }

  async remove(id: number): Promise<void> {
    const notification = await this.findOne(id);
    await notification.destroy();
  }
}
