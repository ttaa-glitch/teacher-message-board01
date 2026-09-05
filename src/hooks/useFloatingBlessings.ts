import { useState, useEffect, useRef } from 'react';

const BLESSING_TEXTS = [
  '老师辛苦了',
  '桃李满天下',
  '教师节快乐',
  '春晖遍四方',
  '师恩难忘',
  '桃李不言 下自成蹊',
  '谆谆教诲 铭记于心',
  '一支粉笔写春秋',
  '三尺讲台育桃李',
  '谢谢您的付出',
  '敬爱的老师 您辛苦了',
  '祝您身体健康',
  '桃李满园 春晖四方',
  '师泽如光 微以致远',
];

export interface FloatingBlessing {
  id: number;
  text: string;
  left: number;
  top: number;
  duration: number;
  fontSize: number;
}

export function useFloatingBlessings(): FloatingBlessing[] {
  const [blessings, setBlessings] = useState<FloatingBlessing[]>([]);
  const idRef = useRef<number>(0);

  useEffect(() => {
    const spawnBlessing = () => {
      const id = (idRef.current += 1);
      const text =
        BLESSING_TEXTS[Math.floor(Math.random() * BLESSING_TEXTS.length)];
      const left = Math.random() * 90 + 5;
      const top = Math.random() * 80 + 10;
      const duration = 5000 + Math.random() * 3000;
      const fontSize = 22 + Math.floor(Math.random() * 16);

      setBlessings((prev) => [
        ...prev,
        { id, text, left, top, duration, fontSize },
      ]);

      window.setTimeout(() => {
        setBlessings((prev) => prev.filter((b) => b.id !== id));
      }, duration);
    };

    for (let i = 0; i < 6; i += 1) {
      window.setTimeout(spawnBlessing, i * 800);
    }

    const interval = window.setInterval(spawnBlessing, 1500);
    return () => window.clearInterval(interval);
  }, []);

  return blessings;
}
