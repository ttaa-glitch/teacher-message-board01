export interface MessageItem {
  id: string;
  graduateYear: string | null;
  className: string;
  studentName: string | null;
  content: string;
  createdAt: string;
}

export interface MessageListResponse {
  items: MessageItem[];
  total: number;
}

export interface CreateMessageRequest {
  graduateYear: string;
  className: string;
  studentName: string;
  content: string;
}

export interface DeleteMessageRequest {
  adminPassword: string;
}

export interface AdminVerifyRequest {
  adminPassword: string;
}

export interface AdminVerifyResponse {
  success: boolean;
}
