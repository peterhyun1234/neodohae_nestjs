import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

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
  })
  description: string;

  @ApiProperty({ description: '시작 시간' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startTime: Date;

  @ApiProperty({ description: '종료 시간' })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endTime: Date;
}
