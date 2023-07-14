import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Todo } from './todo.model';

@Module({
  imports: [SequelizeModule.forFeature([Todo])],
})
export class TodosModule {}
