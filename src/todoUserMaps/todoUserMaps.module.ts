import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TodoUserMap } from './todoUserMap.model';

@Module({
  imports: [SequelizeModule.forFeature([TodoUserMap])],
})
export class TodoUserMapsModule {}
