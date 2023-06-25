import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Room } from './room.model';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room)
    private readonly roomModel: typeof Room,
  ) {}

  async findAll(): Promise<Room[]> {
    return this.roomModel.findAll();
  }

  async findOne(id: string): Promise<Room> {
    return this.roomModel.findByPk(id);
  }

  async findOneByInviteCode(inviteCode: string): Promise<Room> {
    return this.roomModel.findOne({ where: { inviteCode } });
  }

  async create(room: Partial<Room>): Promise<Room> {
    return this.roomModel.create(room);
  }

  async update(id: string, room: Partial<Room>): Promise<number> {
    const [affectedCount] = await this.roomModel.update(room, {
      where: { id },
    });
    return affectedCount;
  }

  async remove(id: string): Promise<void> {
    const room = await this.findOne(id);
    await room.destroy();
  }
}
