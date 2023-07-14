import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Todo } from 'src/todos/todo.model';
import { User } from 'src/users/user.model';

@Table({ tableName: 'TodoUserMaps' })
export class TodoUserMap extends Model {
  @ApiProperty({ type: () => Todo, description: 'Todo' })
  @ForeignKey(() => Todo)
  @Column
  todoId: number;

  @BelongsTo(() => Todo)
  todo: Todo;

  @ApiProperty({ type: () => User, description: 'User' })
  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
