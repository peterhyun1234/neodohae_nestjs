import {
  BeforeCreate,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table
export class User extends Model {
  @ApiProperty({ example: 'username', description: '사용자 이름' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  username: string;

  @ApiProperty({ example: 'test@test.com', description: '사용자 이메일 주소' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: 'providerEmail',
  })
  email: string;

  @ApiProperty({ example: 'male', description: '성별' })
  @Column({
    type: DataType.ENUM,
    values: ['male', 'female', 'undefined'],
    defaultValue: 'undefined',
    allowNull: true,
  })
  gender: string;

  @ApiProperty({ example: 1990, description: '출생 연도' })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  birthYear: number;

  @ApiProperty({
    example:
      'https://neodohaebucket.s3.ap-northeast-2.amazonaws.com/default_profile.jpeg',
    description: '사용자 프로필 사진 URL',
  })
  @Column({
    type: DataType.STRING,
    defaultValue:
      'https://neodohaebucket.s3.ap-northeast-2.amazonaws.com/default_profile.jpeg',
    allowNull: true,
  })
  picture: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: 'providerEmail',
  })
  provider: string;

  @BeforeCreate
  static generateUsername(user: User) {
    if (!user.username) {
      const currentUser = '룸메 ' + user.id;
      user.username = currentUser;
    }
  }
}
