import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from 'src/users/user.model';
import { TodoUserMap } from 'src/todoUserMaps/todoUserMap.model';
import { ApiProperty } from '@nestjs/swagger';

export enum Status {
  TODO = 'TODO',
  DOING = 'DOING',
  DONE = 'DONE',
}

export enum RepeatType {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

@Table({
  tableName: 'Todos',
})
export class Todo extends Model {
  @ApiProperty({ example: 'Title', description: 'Todo의 제목' })
  @Column({ allowNull: false })
  title: string;

  @ApiProperty({ example: 'Description', description: 'Todo의 설명' })
  @Column
  description: string;

  @ApiProperty({
    example: '2023-07-10T00:00:00Z',
    description: 'Todo 시작 시간',
  })
  @Column({ allowNull: false })
  startTime: Date;

  @ApiProperty({
    example: '2023-07-11T00:00:00Z',
    description: 'Todo 종료 시간',
  })
  @Column({ allowNull: false })
  endTime: Date;

  @ApiProperty({ example: 'TODO', description: 'Todo의 상태', enum: Status })
  @Column({
    type: DataType.ENUM('TODO', 'DOING', 'DONE'),
    defaultValue: 'TODO',
  })
  status: Status;

  @ApiProperty({ example: 1, description: '반복 그룹 ID' })
  @Column
  repeatGroupId: number;

  @ApiProperty({
    example: '2023-07-20T00:00:00Z',
    description: '반복 종료 시간',
  })
  @Column
  repeatEndTime: Date;

  @ApiProperty({ example: 'NONE', description: '반복 유형', enum: RepeatType })
  @Column({
    type: DataType.ENUM('NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'),
    defaultValue: 'NONE',
  })
  repeatType: RepeatType;

  @ApiProperty({ example: 1, description: '사용자 ID' })
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ApiProperty({ description: 'Todo 사용자 맵 리스트' })
  @HasMany(() => TodoUserMap)
  todoUserMaps: TodoUserMap[];
}
