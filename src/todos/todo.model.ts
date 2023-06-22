import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table
export class Todo extends Model {
  @ApiProperty({ description: '제목' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @ApiProperty({ description: '설명' })
  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @ApiProperty({ description: '마감일' })
  @Column({
    type: DataType.DATE,
  })
  dueDate: Date;

  @ApiProperty({ description: '반복 주기' })
  @Column({
    type: DataType.STRING,
  })
  repeatCycle: string;

  @ApiProperty({ description: '룸메이트' })
  @Column({
    type: DataType.STRING,
  })
  roommate: string;

  @ApiProperty({ description: '상태', enum: ['To-Do', 'Doing', 'Done'] })
  @Column({
    type: DataType.ENUM,
    values: ['To-Do', 'Doing', 'Done'],
    defaultValue: 'To-Do',
  })
  status: string;
}
