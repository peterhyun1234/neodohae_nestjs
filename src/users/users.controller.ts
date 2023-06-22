import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.model';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '새 사용자 생성' })
  @ApiBody({ type: User, description: '사용자 정보' })
  @ApiResponse({ status: 201, description: '사용자가 생성되었습니다.' })
  create(@Body() user: Partial<User>) {
    return this.usersService.create(user);
  }

  @Get()
  @ApiOperation({ summary: '모든 사용자 조회' })
  @ApiResponse({ status: 200, description: '사용자 목록 반환', type: [User] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID로 사용자 조회' })
  @ApiParam({ name: 'id', required: true, description: '조회할 사용자의 ID' })
  @ApiResponse({
    status: 200,
    description: '해당 ID의 사용자 정보 반환',
    type: User,
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '사용자 정보 수정' })
  @ApiParam({ name: 'id', required: true, description: '수정할 사용자의 ID' })
  @ApiBody({ type: User, description: '수정할 사용자 정보' })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 수정 완료',
    type: User,
  })
  update(@Param('id') id: string, @Body() user: Partial<User>) {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: '사용자 삭제' })
  @ApiParam({ name: 'id', required: true, description: '삭제할 사용자의 ID' })
  @ApiResponse({ status: 200, description: '사용자 삭제 완료', type: User })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
