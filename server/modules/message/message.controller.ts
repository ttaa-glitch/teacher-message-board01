import { Controller, Post, Delete, Body, Param, Get } from '@nestjs/common';
import { MessageService } from './message.service';
import type {
  CreateMessageRequest,
  MessageItem,
  MessageListResponse,
  AdminVerifyRequest,
  AdminVerifyResponse,
  DeleteMessageRequest,
} from '@shared/api.interface';

@Controller('api/messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async createMessage(@Body() dto: CreateMessageRequest): Promise<MessageItem> {
    return this.messageService.createMessage(dto);
  }

  @Post('admin/verify')
  async verifyAdmin(@Body() dto: AdminVerifyRequest): Promise<AdminVerifyResponse> {
    return this.messageService.verifyAdminPassword(dto.adminPassword);
  }

  @Post('admin/list')
  async getAdminList(@Body() dto: AdminVerifyRequest): Promise<MessageListResponse> {
    return this.messageService.getAdminList(dto.adminPassword);
  }

  @Delete('admin/:id')
  async deleteMessage(
    @Param('id') id: string,
    @Body() dto: DeleteMessageRequest,
  ): Promise<{ success: boolean }> {
    return this.messageService.deleteMessage(id, dto.adminPassword);
  }

  @Get('health')
  healthCheck(): { status: string } {
    return { status: 'ok' };
  }
}
