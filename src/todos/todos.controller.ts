import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './todo.model';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: '새 Todo 생성' })
  @ApiBody({ type: Todo, description: 'Todo 정보' })
  @ApiResponse({ status: 201, description: 'Todo가 생성되었습니다.' })
  create(@Body() todo: Partial<Todo>) {
    return this.todosService.create(todo);
  }

  @Get()
  @ApiOperation({ summary: '모든 Todo 조회' })
  @ApiResponse({ status: 200, description: 'Todo 목록 반환', type: [Todo] })
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID로 Todo 조회' })
  @ApiParam({ name: 'id', required: true, description: '조회할 Todo의 ID' })
  @ApiResponse({
    status: 200,
    description: '해당 ID의 Todo 정보 반환',
    type: Todo,
  })
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Todo 정보 수정' })
  @ApiParam({ name: 'id', required: true, description: '수정할 Todo의 ID' })
  @ApiBody({ type: Todo, description: '수정할 Todo 정보' })
  @ApiResponse({ status: 200, description: 'Todo 정보 수정 완료', type: Todo })
  update(@Param('id') id: string, @Body() todo: Partial<Todo>) {
    return this.todosService.update(id, todo);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Todo 삭제' })
  @ApiParam({ name: 'id', required: true, description: '삭제할 Todo의 ID' })
  @ApiResponse({ status: 200, description: 'Todo 삭제 완료', type: Todo })
  remove(@Param('id') id: string) {
    return this.todosService.remove(id);
  }
}
