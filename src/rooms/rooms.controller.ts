import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoomsService } from './rooms.service';
import { UsersService } from '../users/users.service';
import { Room } from './room.model';
import { User } from '../users/user.model';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: '새 Room 생성' })
  @ApiBody({ type: Room, description: 'Room 정보' })
  @ApiResponse({ status: 201, description: 'Room이 생성되었습니다.' })
  create(@Body() room: Partial<Room>) {
    return this.roomsService.create(room);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: '모든 Room 조회' })
  @ApiResponse({
    status: 200,
    description: 'Room 목록 반환',
    type: [Room],
  })
  findAll() {
    return this.roomsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/id/:id')
  @ApiOperation({ summary: 'ID로 Room 조회' })
  @ApiParam({ name: 'id', required: true, description: '조회할 Room의 ID' })
  @ApiResponse({
    status: 200,
    description: '해당 ID의 Room 정보 반환',
    type: Room,
  })
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/inviteCode/:inviteCode')
  @ApiOperation({ summary: 'Invite Code로 Room 조회' })
  @ApiParam({
    name: 'inviteCode',
    required: true,
    description: '조회할 Room의 Invite Code',
  })
  @ApiResponse({
    status: 200,
    description: '해당 Invite Code의 Room 정보 반환',
    type: Room,
  })
  findOneByInviteCode(@Param('inviteCode') inviteCode: string) {
    return this.roomsService.findOneByInviteCode(inviteCode);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/users')
  @ApiOperation({ summary: 'Room에 속한 모든 룸메이트 조회' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '룸메이트를 조회할 Room의 ID',
  })
  @ApiResponse({
    status: 200,
    description: '해당 Room의 룸메이트 정보 반환',
    type: [User],
  })
  findAllByRoomId(@Param('id') id: string) {
    return this.usersService.findAllByRoomId(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/id/:id')
  @ApiOperation({ summary: 'Room 정보 수정' })
  @ApiParam({ name: 'id', required: true, description: '수정할 Room의 ID' })
  @ApiBody({ type: Room, description: '수정할 Room 정보' })
  @ApiResponse({
    status: 200,
    description: 'Room 정보 수정 완료',
    type: Room,
  })
  update(@Param('id') id: string, @Body() room: Partial<Room>) {
    return this.roomsService.update(id, room);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/id/:id')
  @ApiOperation({ summary: 'Room 삭제' })
  @ApiParam({ name: 'id', required: true, description: '삭제할 Room의 ID' })
  @ApiResponse({
    status: 200,
    description: 'Room 삭제 완료',
    type: Room,
  })
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }
}
