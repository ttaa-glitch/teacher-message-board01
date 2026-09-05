import { Injectable, Logger, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { eq, desc, count } from 'drizzle-orm';
import { db } from '../database';
import { message } from '../database/schema';
import type {
  MessageItem,
  MessageListResponse,
  CreateMessageRequest,
  AdminVerifyResponse,
} from '@shared/api.interface';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  private checkAdminPassword(password: string): boolean {
    const expected = process.env.ADMIN_PASSWORD || '123456';
    return password === expected;
  }

  async createMessage(dto: CreateMessageRequest): Promise<MessageItem> {
    const trimmedGraduateYear = dto.graduateYear?.trim() || '';
    const trimmedClassName = dto.className?.trim() || '';
    const trimmedStudentName = dto.studentName?.trim() || '';
    const trimmedContent = dto.content?.trim() || '';

    if (trimmedGraduateYear.length > 20) {
      throw new BadRequestException('毕业年份长度不能超过 20 字符');
    }
    if (trimmedClassName.length < 1 || trimmedClassName.length > 100) {
      throw new BadRequestException('班级名称长度必须在 1-100 字符之间');
    }
    if (trimmedStudentName.length > 50) {
      throw new BadRequestException('姓名长度不能超过 50 字符');
    }
    if (trimmedContent.length < 1 || trimmedContent.length > 2000) {
      throw new BadRequestException('留言内容长度必须在 1-2000 字符之间');
    }

    try {
      const result = await db
        .insert(message)
        .values({
          graduateYear: trimmedGraduateYear || null,
          className: trimmedClassName,
          studentName: trimmedStudentName || null,
          content: trimmedContent,
        })
        .returning();

      const row = result[0];
      return {
        id: row.id,
        graduateYear: row.graduateYear ?? null,
        className: row.className,
        studentName: row.studentName ?? null,
        content: row.content,
        createdAt: row.createdAt.toISOString(),
      };
    } catch (error) {
      this.logger.error(`创建留言失败: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async verifyAdminPassword(password: string): Promise<AdminVerifyResponse> {
    return { success: this.checkAdminPassword(password) };
  }

  async getAdminList(password: string): Promise<MessageListResponse> {
    if (!this.checkAdminPassword(password)) {
      throw new ForbiddenException('管理员密码错误');
    }

    try {
      const [countResult, rows] = await Promise.all([
        db.select({ count: count() }).from(message),
        db
          .select()
          .from(message)
          .orderBy(desc(message.createdAt)),
      ]);

      const items: MessageItem[] = rows.map((row) => ({
        id: row.id,
        graduateYear: row.graduateYear ?? null,
        className: row.className,
        studentName: row.studentName ?? null,
        content: row.content,
        createdAt: row.createdAt.toISOString(),
      }));

      const total = Number(countResult[0]?.count ?? 0);

      return { items, total };
    } catch (error) {
      this.logger.error(`获取留言列表失败: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  async deleteMessage(id: string, password: string): Promise<{ success: boolean }> {
    if (!this.checkAdminPassword(password)) {
      throw new ForbiddenException('管理员密码错误');
    }

    try {
      const deleted = await db
        .delete(message)
        .where(eq(message.id, id))
        .returning({ id: message.id });

      if (deleted.length === 0) {
        throw new NotFoundException('留言不存在');
      }

      return { success: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`删除留言失败: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }
}
