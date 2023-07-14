import {
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Room } from 'src/rooms/room.model';
import { Message } from 'src/messages/message.model';
import { Schedule } from 'src/schedules/schedule.model';
import { Todo } from 'src/todos/todo.model';
import { TodoUserMap } from 'src/todoUserMaps/todoUserMap.model';

const colors = [
  '#ffb3b3',
  '#ffdcb3',
  '#c0ce92',
  '#a6d497',
  '#92d1ab',
  '#b3dfff',
  '#98dbd7',
  '#b7b3ff',
  '#e2b3ff',
  '#ffb3e9',
];

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

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  color: string;

  @ForeignKey(() => Room)
  @Column
  roomId: number;

  @BelongsTo(() => Room)
  room: Room;

  @HasMany(() => Message, { onDelete: 'CASCADE' })
  messages: Message[];

  @HasMany(() => Schedule, { onDelete: 'CASCADE' })
  schedules: Schedule[];

  @HasMany(() => Todo, { onDelete: 'CASCADE' })
  todos: Todo[];

  @HasMany(() => TodoUserMap, { onDelete: 'CASCADE' })
  todoUserMaps: TodoUserMap[];

  @BeforeCreate
  static generateUsername(user: User) {
    if (!user.username) {
      const randomInteger = Math.floor(Math.random() * 100000);
      const currentUser = '룸메 ' + randomInteger;
      user.username = currentUser;
    }
  }

  @BeforeUpdate
  static async assignColor(user: User) {
    if (user.roomId !== undefined && user.roomId !== null) {
      const roomUsers = await User.findAll({
        where: { roomId: user.roomId },
      });
      const usedColors = roomUsers.map((user) => user.color);
      const availableColors = colors.filter(
        (color) => !usedColors.includes(color),
      );

      let colorToAssign;
      if (availableColors.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableColors.length);
        colorToAssign = availableColors[randomIndex];
      } else {
        colorToAssign = '#a0a0a0';
      }

      user.color = colorToAssign;
    } else if (user.roomId === null) {
      user.color = null;
    }
  }
}
