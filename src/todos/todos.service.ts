import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Todo } from './todo.model';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo)
    private readonly todoModel: typeof Todo,
  ) {}

  async findAll(): Promise<Todo[]> {
    return this.todoModel.findAll();
  }

  async findOne(id: string): Promise<Todo> {
    return this.todoModel.findByPk(id);
  }

  async create(todo: Partial<Todo>): Promise<Todo> {
    return this.todoModel.create(todo);
  }

  async update(id: string, todo: Partial<Todo>): Promise<number> {
    const [affectedCount] = await this.todoModel.update(todo, {
      where: { id },
    });
    return affectedCount;
  }

  async remove(id: string): Promise<void> {
    const todo = await this.findOne(id);
    await todo.destroy();
  }
}
