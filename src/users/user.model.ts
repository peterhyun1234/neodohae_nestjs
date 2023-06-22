import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table
export class User extends Model {
  @ApiProperty({ example: 'username', description: '사용자 이름' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username: string;

  @ApiProperty({ example: 'test@test.com', description: '사용자 이메일 주소' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @ApiProperty({ example: 'male', description: '성별' })
  @Column({
    type: DataType.ENUM,
    values: ['male', 'female'],
    allowNull: false,
  })
  gender: string;

  @ApiProperty({ example: 1990, description: '출생 연도' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  birthYear: number;
}
