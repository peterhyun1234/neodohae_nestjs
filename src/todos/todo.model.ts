import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Todo extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @Column({
    type: DataType.DATE,
  })
  dueDate: Date;

  @Column({
    type: DataType.STRING,
  })
  repeatCycle: string;

  @Column({
    type: DataType.STRING,
  })
  roommate: string;

  @Column({
    type: DataType.ENUM,
    values: ['To-Do', 'Doing', 'Done'],
    defaultValue: 'To-Do',
  })
  status: string;
}
