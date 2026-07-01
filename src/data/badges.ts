import type { Badge } from '@/types/badge';

export const badges: Badge[] = [
  {
    id: 'b1',
    name: '初出茅庐',
    description: '完成你的第一个学习章节，开启运维之旅',
    icon: '🌱',
    condition: '完成任意1个章节',
    unlocked: true,
    unlockedAt: '2024-06-02',
  },
  {
    id: 'b2',
    name: '勤学苦练',
    description: '连续学习3天，保持好习惯',
    icon: '🔥',
    condition: '连续打卡3天',
    unlocked: true,
    unlockedAt: '2024-06-04',
  },
  {
    id: 'b3',
    name: '实践达人',
    description: '完成3个在线实验，动手能力MAX',
    icon: '🛠️',
    condition: '完成3个实验',
    unlocked: false,
  },
  {
    id: 'b4',
    name: 'Shell小能手',
    description: '完成Shell脚本入门路径，解放双手',
    icon: '🐚',
    condition: '完成Shell路径',
    unlocked: false,
  },
  {
    id: 'b5',
    name: '百指神功',
    description: '累计输入1000条命令',
    icon: '⌨️',
    condition: '终端输入1000条命令',
    unlocked: false,
  },
];
