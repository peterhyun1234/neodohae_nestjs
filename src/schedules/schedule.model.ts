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
export class Schedule extends Model {
  @ApiProperty({ description: '제목' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @ApiProperty({ description: '설명' })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: '',
  })
  description: string;

  @ApiProperty({ description: '시작 시간' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('startTime');
      if (rawValue) {
        return rawValue.toISOString().split('.')[0];
      }
      return rawValue;
    },
    set(value: Date) {
      this.setDataValue('startTime', new Date(value));
    },
  })
  startTime: Date;

  @ApiProperty({ description: '종료 시간' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('endTime');
      if (rawValue) {
        return rawValue.toISOString().split('.')[0];
      }
      return rawValue;
    },
    set(value: Date) {
      this.setDataValue('endTime', new Date(value));
    },
  })
  endTime: Date;

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
