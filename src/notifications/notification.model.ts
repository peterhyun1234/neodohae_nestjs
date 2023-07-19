import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Model,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.model';

@Table
export class Notification extends Model {
  @ApiProperty({ description: '제목' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @ApiProperty({ description: '내용' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: '',
  })
  body: string;

  @ApiProperty({ description: '읽음 여부' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isRead: boolean;

  @ApiProperty({ description: '사용자 ID' })
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
