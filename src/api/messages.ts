import axios from 'axios';
import type {
  MessageItem,
  MessageListResponse,
  CreateMessageRequest,
  AdminVerifyRequest,
  AdminVerifyResponse,
  DeleteMessageRequest,
} from '@shared/api.interface';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export async function createMessage(
  data: CreateMessageRequest,
): Promise<MessageItem> {
  const response = await api.post<MessageItem>('/messages', data);
  return response.data;
}

export async function getMessageList(
  adminPassword: string,
): Promise<MessageListResponse> {
  const response = await api.post<MessageListResponse>('/messages/admin/list', {
    adminPassword,
  } satisfies AdminVerifyRequest);
  return response.data;
}

export async function deleteMessage(
  id: string,
  adminPassword: string,
): Promise<{ success: boolean }> {
  const response = await api.delete<{ success: boolean }>(
    `/messages/admin/${id}`,
    {
      data: { adminPassword } satisfies DeleteMessageRequest,
    },
  );
  return response.data;
}

export async function verifyAdminPassword(
  adminPassword: string,
): Promise<AdminVerifyResponse> {
  const response = await api.post<AdminVerifyResponse>(
    '/messages/admin/verify',
    { adminPassword } satisfies AdminVerifyRequest,
  );
  return response.data;
}
