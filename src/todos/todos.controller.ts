import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './todo.model';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  findAll(): Promise<Todo[]> {
    return this.todosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Todo> {
    return this.todosService.findOne(id);
  }

  @Post()
  create(@Body() todo: Partial<Todo>): Promise<Todo> {
    return this.todosService.create(todo);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() todo: Partial<Todo>,
  ): Promise<number> {
    return this.todosService.update(id, todo);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.todosService.remove(id);
  }
}
