import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Message } from './message.model';
import { MessagesService } from './messages.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: '새 메시지 생성' })
  @ApiBody({ type: Message, description: '메시지 내용' })
  @ApiResponse({
    status: 201,
    description: '메시지가 성공적으로 생성되었습니다.',
  })
  async create(
    @Body()
    createMessageDto: {
      senderId: number;
      roomId: number;
      content: string;
    },
  ): Promise<Message> {
    return this.messagesService.create(createMessageDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: '모든 메시지 가져오기' })
  @ApiResponse({
    status: 200,
    description: '모든 메시지를 반환합니다.',
    type: [Message],
  })
  async findAll(): Promise<Message[]> {
    return this.messagesService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({ summary: 'ID로 메시지 가져오기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '가져올 메시지의 ID',
  })
  @ApiResponse({
    status: 200,
    description: '지정된 ID의 메시지를 반환합니다.',
    type: Message,
  })
  async findOne(@Param('id') id: string): Promise<Message> {
    return this.messagesService.findOneById(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: '메시지 삭제' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '삭제할 메시지의 ID',
  })
  @ApiResponse({
    status: 200,
    description: '메시지가 성공적으로 삭제되었습니다.',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.messagesService.remove(+id);
  }
}
