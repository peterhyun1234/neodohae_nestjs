import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.model';

@Table
export class Subscription extends Model {
  @PrimaryKey
  @Column(DataType.STRING)
  @ApiProperty({ description: 'The endpoint of the subscription' })
  endpoint: string;

  @Column(DataType.JSON)
  @ApiProperty({
    description: 'The keys for the subscription',
    type: 'object',
    example: {
      p256dh: 'example_p256dh',
      auth: 'example_auth',
    },
  })
  keys: {
    p256dh: string;
    auth: string;
  };

  @ForeignKey(() => User)
  @Column
  @ApiProperty({
    description: 'The ID of the user associated with the subscription',
  })
  userId: number;

  @BelongsTo(() => User)
  @ApiProperty({ description: 'The user associated with the subscription' })
  user: User;
}
