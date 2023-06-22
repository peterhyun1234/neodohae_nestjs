import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Schedule extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: Date;
}
