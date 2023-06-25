import {
  BeforeCreate,
  Column,
  DataType,
  Model,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { randomBytes } from 'crypto';
import { User } from 'src/users/user.model';

@Table
export class Room extends Model {
  @ApiProperty({ example: 'room_name', description: '방 이름' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  roomName: string;

  @ApiProperty({ example: 'invite_code', description: '초대 코드' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  inviteCode: string;

  @HasMany(() => User)
  users: User[];

  @BeforeCreate
  static async generateInviteCode(room: Room) {
    const length = 8;
    let isDuplicate = true;
    let inviteCode = '';

    while (isDuplicate) {
      const bytes = randomBytes(Math.ceil(length / 2));
      inviteCode = bytes.toString('hex').slice(0, length);

      const existingRoom = await Room.findOne({ where: { inviteCode } });

      if (!existingRoom) {
        isDuplicate = false;
      }
    }

    room.inviteCode = inviteCode;
  }
}
