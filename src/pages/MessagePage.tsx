import { useState, type FormEvent, useEffect, useRef } from 'react';
import { Send, CheckCircle, AlertCircle, Sparkles, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createMessage } from '@/api/messages';
import { useFloatingBlessings } from '@/hooks/useFloatingBlessings';

const GRADUATE_YEARS: string[] = Array.from(
  { length: 2030 - 1970 + 1 },
  (_, i) => `${1970 + i}届`,
).reverse();

export default function MessagePage() {
  const [graduateYear, setGraduateYear] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [successVisible, setSuccessVisible] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [yearDropdownOpen, setYearDropdownOpen] = useState<boolean>(false);
  const blessings = useFloatingBlessings();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const CONTENT_MAX_LENGTH = 2000;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setYearDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectYear = (year: string) => {
    setGraduateYear(year);
    setYearDropdownOpen(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedClass = className.trim();
    const trimmedContent = content.trim();

    if (!trimmedClass) {
      setErrorMsg('请输入你的班级');
      return;
    }
    if (!trimmedContent) {
      setErrorMsg('请写下你想对老师说的话');
      return;
    }
    if (trimmedContent.length > CONTENT_MAX_LENGTH) {
      setErrorMsg(`留言内容不能超过 ${CONTENT_MAX_LENGTH} 字`);
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      await createMessage({
        graduateYear,
        className: trimmedClass,
        studentName: studentName.trim(),
        content: trimmedContent,
      });
      setGraduateYear('');
      setClassName('');
      setStudentName('');
      setContent('');
      setSuccessVisible(true);
      toast.success('提交成功！感谢你的心意');
      window.setTimeout(() => {
        setSuccessVisible(false);
      }, 3000);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || '提交失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{ backgroundColor: '#fff9f2' }}
    >
      {/* 浮动祝福文案背景 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {blessings.map((b) => (
          <span
            key={b.id}
            className="absolute select-none"
            style={{
              left: `${b.left}%`,
              top: `${b.top}%`,
              fontSize: `${b.fontSize}px`,
              color: '#ff8c42',
              opacity: 0,
              fontWeight: 500,
              animation: `blessingFloat ${b.duration}ms ease-out forwards`,
              whiteSpace: 'nowrap',
            }}
          >
            {b.text}
          </span>
        ))}
      </div>

      {/* 装饰光晕背景 */}
      <div
        className="pointer-events-none absolute top-0 left-0 w-full h-[420px] opacity-60"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(255, 140, 66, 0.18) 0%, rgba(255, 209, 102, 0.08) 45%, transparent 75%)',
        }}
      />
      <div
        className="pointer-events-none absolute top-24 right-[-60px] w-[200px] h-[200px] rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: '#ffd166' }}
      />
      <div
        className="pointer-events-none absolute top-[200px] left-[-80px] w-[220px] h-[220px] rounded-full opacity-25 blur-3xl"
        style={{ backgroundColor: '#e85d4f' }}
      />

      <style>{`
        @keyframes blessingFloat {
          0% {
            opacity: 0;
            transform: translateY(0);
          }
          15% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.22;
          }
          100% {
            opacity: 0;
            transform: translateY(-100px);
          }
        }
      `}</style>

      <div className="relative z-10 max-w-[600px] mx-auto px-4 md:px-6 py-10 md:py-16">
        {/* 标题区 */}
        <header className="text-center mb-8 md:mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
            style={{
              backgroundColor: 'rgba(255, 140, 66, 0.12)',
              color: '#e85d4f',
            }}
          >
            <Sparkles size={16} />
            <span className="text-sm font-medium">感恩教师节</span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold mb-3 tracking-tight"
            style={{ color: '#3d2c1e' }}
          >
            教师节快乐
          </h1>
          <p className="text-base md:text-lg" style={{ color: '#7a6a5c' }}>
            留下你想对老师说的话
          </p>
        </header>

        {/* 留言卡片 */}
        <div
          className="rounded-2xl p-6 md:p-8"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(255, 140, 66, 0.1)',
          }}
        >
          {/* 成功提示 */}
          {successVisible && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-lg mb-5"
              style={{
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                color: '#2e7d32',
              }}
            >
              <CheckCircle size={18} />
              <span className="text-sm font-medium">
                提交成功！感谢你的心意
              </span>
            </div>
          )}

          {/* 错误提示 */}
          {errorMsg && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-lg mb-5"
              style={{
                backgroundColor: 'rgba(232, 93, 79, 0.1)',
                color: '#c62828',
              }}
            >
              <AlertCircle size={18} />
              <span className="text-sm font-medium">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 毕业年份 + 班级 同一行 */}
            <div className="flex gap-3">
              {/* 毕业年份下拉 */}
              <div className="space-y-2 flex-1" style={{ minWidth: 0 }}>
                <label
                  className="text-sm font-medium block"
                  style={{ color: '#3d2c1e' }}
                >
                  毕业年份
                </label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setYearDropdownOpen((v) => !v)}
                    disabled={loading}
                    className="w-full flex items-center justify-between px-3 text-left"
                    style={{
                      height: '44px',
                      borderRadius: '10px',
                      border: '1px solid #f0e6d9',
                      backgroundColor: '#fffdf9',
                      color: graduateYear ? '#3d2c1e' : '#a8988a',
                      fontSize: '15px',
                    }}
                  >
                    <span className="truncate">
                      {graduateYear || '请选择'}
                    </span>
                    <ChevronDown
                      size={18}
                      style={{
                        color: '#a8988a',
                        transition: 'transform 0.2s',
                        transform: yearDropdownOpen
                          ? 'rotate(180deg)'
                          : 'rotate(0)',
                        flexShrink: 0,
                      }}
                    />
                  </button>
                  {yearDropdownOpen && (
                    <div
                      className="absolute z-20 left-0 right-0 mt-1 py-1 max-h-60 overflow-y-auto"
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '10px',
                        border: '1px solid #f0e6d9',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      {GRADUATE_YEARS.map((year) => (
                        <button
                          key={year}
                          type="button"
                          onClick={() => handleSelectYear(year)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 transition-colors"
                          style={{
                            color:
                              graduateYear === year ? '#ff8c42' : '#3d2c1e',
                            fontWeight: graduateYear === year ? 600 : 400,
                          }}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 班级输入 */}
              <div className="space-y-2 flex-1" style={{ minWidth: 0 }}>
                <label
                  htmlFor="className"
                  className="text-sm font-medium block"
                  style={{ color: '#3d2c1e' }}
                >
                  班级
                </label>
                <Input
                  id="className"
                  type="text"
                  placeholder="如：3班、5班"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  disabled={loading}
                  maxLength={50}
                  className="w-full"
                  style={{
                    borderRadius: '10px',
                    borderColor: '#f0e6d9',
                    backgroundColor: '#fffdf9',
                    color: '#3d2c1e',
                    height: '44px',
                    fontSize: '15px',
                  } as React.CSSProperties}
                />
              </div>
            </div>

            {/* 姓名输入 */}
            <div className="space-y-2">
              <label
                htmlFor="studentName"
                className="text-sm font-medium block"
                style={{ color: '#3d2c1e' }}
              >
                姓名
              </label>
              <Input
                id="studentName"
                type="text"
                placeholder="匿名可不填~"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                disabled={loading}
                maxLength={50}
                className="w-full"
                style={{
                  borderRadius: '10px',
                  borderColor: '#f0e6d9',
                  backgroundColor: '#fffdf9',
                  color: '#3d2c1e',
                  height: '44px',
                  fontSize: '15px',
                } as React.CSSProperties}
              />
            </div>

            {/* 留言内容 */}
            <div className="space-y-2">
              <label
                htmlFor="content"
                className="text-sm font-medium block"
                style={{ color: '#3d2c1e' }}
              >
                留言内容
              </label>
              <Textarea
                id="content"
                placeholder="写下你想对老师说的话..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
                maxLength={CONTENT_MAX_LENGTH}
                rows={6}
                className="w-full resize-none"
                style={{
                  borderRadius: '10px',
                  borderColor: '#f0e6d9',
                  backgroundColor: '#fffdf9',
                  color: '#3d2c1e',
                  minHeight: '150px',
                  fontSize: '15px',
                  lineHeight: 1.6,
                  paddingTop: '10px',
                  paddingBottom: '10px',
                } as React.CSSProperties}
              />
              <div
                className="text-right text-xs"
                style={{ color: '#7a6a5c' }}
              >
                {content.length} / {CONTENT_MAX_LENGTH}
              </div>
            </div>

            {/* 提交按钮 */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full font-medium text-base"
              style={{
                height: '48px',
                borderRadius: '12px',
                background:
                  'linear-gradient(135deg, #ff8c42 0%, #e85d4f 100%)',
                color: '#ffffff',
                border: 'none',
                boxShadow: '0 4px 14px rgba(255, 140, 66, 0.35)',
              } as React.CSSProperties}
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  <Send size={18} />
                  送出祝福
                </>
              )}
            </Button>
          </form>
        </div>

        {/* 底部温馨提示 */}
        <p
          className="text-center text-sm mt-6"
          style={{ color: '#a8988a' }}
        >
          每一句祝福，都是老师最珍贵的礼物
        </p>
      </div>
    </div>
  );
}
