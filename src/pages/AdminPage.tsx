import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Trash2, LogOut, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  verifyAdminPassword,
  getMessageList,
  deleteMessage,
} from '@/api/messages';
import type { MessageItem } from '@shared/api.interface';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [listLoading, setListLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!passwordInput.trim()) {
      setErrorMsg('请输入管理密码');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await verifyAdminPassword(passwordInput);
      if (res.success) {
        setPassword(passwordInput);
        setIsAuthenticated(true);
        setPasswordInput('');
        toast.success('登录成功');
      } else {
        setErrorMsg('密码错误，请重试');
      }
    } catch {
      setErrorMsg('密码错误，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    setListLoading(true);
    try {
      const res = await getMessageList(password);
      setMessages(res.items || []);
      setTotal(res.total || 0);
    } catch {
      setIsAuthenticated(false);
      setPassword('');
      toast.error('登录已过期，请重新登录');
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这条留言吗？删除后无法恢复。')) {
      return;
    }
    try {
      await deleteMessage(id, password);
      setMessages((prev) => prev.filter((item) => item.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      toast.success('删除成功');
    } catch {
      toast.error('删除失败，请稍后重试');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setMessages([]);
    setTotal(0);
    setErrorMsg('');
  };

  const formatTime = (timeStr: string): string => {
    return dayjs(timeStr).format('YYYY-MM-DD HH:mm');
  };

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center px-4 py-8"
        style={{ backgroundColor: '#fff9f2' }}
      >
        <div
          className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
          style={{ boxShadow: '0 4px 20px rgba(255, 140, 66, 0.1)' }}
        >
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#fff1e6' }}
            >
              <Shield className="w-7 h-7" style={{ color: '#ff8c42' }} />
            </div>
            <h1 className="text-xl font-bold" style={{ color: '#3d2c1e' }}>
              管理后台登录
            </h1>
            <p className="text-sm mt-1" style={{ color: '#7a6a5c' }}>
              请输入管理密码以查看留言
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="请输入管理密码"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLogin();
                }}
                className="h-11 text-base"
                style={{
                  borderRadius: '10px',
                  borderColor: errorMsg ? '#e85d4f' : '#f0e6d9',
                  backgroundColor: '#fffdf9',
                } as React.CSSProperties}
              />
            </div>

            {errorMsg && (
              <p className="text-sm" style={{ color: '#e85d4f' }}>
                {errorMsg}
              </p>
            )}

            <Button
              className="w-full h-11 text-base font-medium"
              style={{
                borderRadius: '12px',
                backgroundColor: '#ff8c42',
                color: '#ffffff',
                border: 'none',
              } as React.CSSProperties}
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full px-4 md:px-6 py-6 md:py-8"
      style={{ backgroundColor: '#fff9f2' }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-xl md:text-2xl font-bold"
              style={{ color: '#3d2c1e' }}
            >
              教师节留言管理
            </h1>
            <p className="text-sm mt-1" style={{ color: '#7a6a5c' }}>
              共{' '}
              <span
                style={{ color: '#ff8c42', fontWeight: 600 }}
              >
                {total}
              </span>{' '}
              条留言
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            style={{
              borderRadius: '10px',
              borderColor: '#f0e6d9',
              color: '#7a6a5c',
              backgroundColor: '#ffffff',
            } as React.CSSProperties}
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            退出
          </Button>
        </div>

        {listLoading && (
          <div
            className="rounded-2xl bg-white p-10 flex flex-col items-center justify-center"
            style={{ boxShadow: '0 4px 20px rgba(255, 140, 66, 0.1)' }}
          >
            <div
              className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mb-3"
              style={{ borderColor: '#ff8c42', borderTopColor: 'transparent' }}
            />
            <p style={{ color: '#7a6a5c' }}>加载中...</p>
          </div>
        )}

        {!listLoading && messages.length === 0 && (
          <div
            className="rounded-2xl bg-white p-10 flex flex-col items-center justify-center"
            style={{ boxShadow: '0 4px 20px rgba(255, 140, 66, 0.1)' }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#fff1e6' }}
            >
              <Shield className="w-8 h-8" style={{ color: '#ff8c42' }} />
            </div>
            <p className="font-medium" style={{ color: '#3d2c1e' }}>
              暂无留言
            </p>
            <p className="text-sm mt-1" style={{ color: '#7a6a5c' }}>
              还没有人提交留言哦
            </p>
          </div>
        )}

        {!listLoading && messages.length > 0 && (
          <div className="space-y-4">
            {messages.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white p-5 md:p-6 transition-all"
                style={{ boxShadow: '0 4px 20px rgba(255, 140, 66, 0.1)' }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {item.graduateYear && (
                    <Badge
                      className="text-xs font-medium"
                      style={{
                        backgroundColor: '#fff1e6',
                        color: '#ff8c42',
                        border: '1px solid #ffd9bd',
                        borderRadius: '8px',
                        padding: '4px 10px',
                      } as React.CSSProperties}
                    >
                      {item.graduateYear}
                    </Badge>
                  )}
                  <Badge
                    className="text-xs font-medium"
                    style={{
                      backgroundColor: '#fff7e6',
                      color: '#e8a44f',
                      border: '1px solid #ffe6bd',
                      borderRadius: '8px',
                      padding: '4px 10px',
                    } as React.CSSProperties}
                  >
                    {item.className}
                  </Badge>
                  {item.studentName && (
                    <span
                      className="text-xs font-medium"
                      style={{ color: '#7a6a5c' }}
                    >
                      {item.studentName}
                    </span>
                  )}
                  <button
                    className="ml-auto flex items-center gap-1 text-sm transition-colors shrink-0 hover:opacity-80"
                    style={{ color: '#e85d4f' }}
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    删除
                  </button>
                </div>

                <p
                  className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words"
                  style={{ color: '#3d2c1e' }}
                >
                  {item.content}
                </p>

                <div
                  className="mt-3 text-xs"
                  style={{ color: '#a8988a' }}
                >
                  {formatTime(item.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
