import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Room } from './room.model';
import { User } from 'src/users/user.model';
import { Schedule } from 'src/schedules/schedule.model';

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);

  constructor(
    @InjectModel(Room)
    private readonly roomModel: typeof Room,
  ) {}

  async findAll(): Promise<Room[]> {
    try {
      this.logger.log('Finding all rooms');
      return this.roomModel.findAll();
    } catch (error) {
      this.logger.error(
        `Failed to find all rooms: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<Room> {
    try {
      this.logger.log(`Finding room with id: ${id}`);
      return this.roomModel.findByPk(id);
    } catch (error) {
      this.logger.error(
        `Failed to find room with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOneByInviteCode(inviteCode: string): Promise<Room> {
    try {
      this.logger.log(`Finding room with invite code: ${inviteCode}`);
      return this.roomModel.findOne({ where: { inviteCode } });
    } catch (error) {
      this.logger.error(
        `Failed to find room with invite code ${inviteCode}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findSchedulesByRoomId(roomId: number): Promise<Room> {
    try {
      this.logger.log(`Finding schedules with room id: ${roomId}`);
      const room = await this.roomModel.findOne({
        where: { id: roomId },
        include: [
          {
            model: User,
            include: [Schedule],
            attributes: ['username', 'color'],
          },
        ],
      });

      if (!room) {
        throw new NotFoundException(`Room with ID ${roomId} not found.`);
      }

      return room;
    } catch (error) {
      this.logger.error(
        `Failed to find schedules with room id ${roomId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async create(room: Partial<Room>): Promise<Room> {
    try {
      this.logger.log(`Creating room: ${JSON.stringify(room)}`);
      return this.roomModel.create(room);
    } catch (error) {
      this.logger.error(`Failed to create room: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, room: Partial<Room>): Promise<number> {
    try {
      this.logger.log(`Updating room with id: ${id}`);
      const [affectedCount] = await this.roomModel.update(room, {
        where: { id },
      });
      this.logger.log(`Updated room count: ${affectedCount}`);
      return affectedCount;
    } catch (error) {
      this.logger.error(
        `Failed to update room with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      this.logger.log(`Removing room with id: ${id}`);
      const room = await this.findOne(id);
      await room.destroy();
      this.logger.log(`Removed room with id: ${id}`);
    } catch (error) {
      this.logger.error(
        `Failed to remove room with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
