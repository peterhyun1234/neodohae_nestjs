import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  CreatedAt,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.model';
import { Room } from 'src/rooms/room.model';

@Table
export class Message extends Model {
  @ApiProperty({ description: '메시지 내용' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  content: string;

  @ApiProperty({ description: '메시지 생성 시간' })
  @CreatedAt
  timestamp: Date;

  @ApiProperty({ description: '메시지를 보낸 사용자' })
  @ForeignKey(() => User)
  @Column
  senderId: number;

  @BelongsTo(() => User, 'senderId')
  sender: User;

  @ApiProperty({ description: '메시지가 속한 방' })
  @ForeignKey(() => Room)
  @Column
  roomId: number;

  @BelongsTo(() => Room)
  room: Room;
}
