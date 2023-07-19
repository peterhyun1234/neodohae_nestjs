import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Room } from './room.model';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { User } from '../users/user.model';
import { UsersService } from '../users/users.service';

@Module({
  imports: [SequelizeModule.forFeature([Room, User])],
  controllers: [RoomsController],
  providers: [RoomsService, UsersService],
})
export class RoomsModule {}
