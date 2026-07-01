import { create } from 'zustand';
import type { User, LearningProgress, LabProgress } from '@/types/user';
import { storage } from '@/utils/storage';

interface UserState {
  user: User | null;
  learningProgress: LearningProgress[];
  labProgress: LabProgress[];
  isLoggedIn: boolean;

  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
  updateLearningProgress: (pathId: string, chapterId: string, progress: number, status: LearningProgress['status']) => void;
  updateLabProgress: (labId: string, completedSteps: number, totalSteps: number, status: LabProgress['status']) => void;
  addStudyTime: (minutes: number) => void;
  addExp: (exp: number) => void;
}

const defaultUser: User = {
  id: 'user_001',
  username: '运维小白',
  email: 'xiaobai@opsmaster.com',
  avatar: '',
  signature: '从0开始的运维之路，加油！',
  level: 5,
  exp: 1234,
  streakDays: 3,
  totalStudyTime: 1410,
  createdAt: '2024-06-01',
};

export const useUserStore = create<UserState>((set, get) => ({
  user: storage.get('user', defaultUser),
  learningProgress: storage.get('learningProgress', [
    { pathId: 'linux-basic', chapterId: 'ch1', status: 'completed', progress: 100, lastReadAt: '2024-06-28' },
    { pathId: 'linux-basic', chapterId: 'ch2', status: 'completed', progress: 100, lastReadAt: '2024-06-28' },
    { pathId: 'linux-basic', chapterId: 'ch3', status: 'in_progress', progress: 60, lastReadAt: '2024-06-30' },
    { pathId: 'shell-basic', chapterId: 'ch1', status: 'completed', progress: 100, lastReadAt: '2024-06-25' },
    { pathId: 'shell-basic', chapterId: 'ch2', status: 'in_progress', progress: 30, lastReadAt: '2024-06-26' },
  ]),
  labProgress: storage.get('labProgress', [
    { labId: 'linux-commands', status: 'completed', completedSteps: 5, totalSteps: 5, bestTime: 1200, completedAt: '2024-06-28' },
    { labId: 'user-permission', status: 'in_progress', completedSteps: 2, totalSteps: 4, bestTime: undefined, completedAt: undefined },
  ]),
  isLoggedIn: storage.get('isLoggedIn', true),

  setUser: (user) => {
    set({ user, isLoggedIn: true });
    storage.set('user', user);
    storage.set('isLoggedIn', true);
  },

  updateUser: (updates) => {
    const user = get().user;
    if (!user) return;
    const updated = { ...user, ...updates };
    set({ user: updated });
    storage.set('user', updated);
  },

  logout: () => {
    set({ user: null, isLoggedIn: false });
    storage.set('isLoggedIn', false);
  },

  updateLearningProgress: (pathId, chapterId, progress, status) => {
    const list = [...get().learningProgress];
    const idx = list.findIndex(p => p.pathId === pathId && p.chapterId === chapterId);
    const now = new Date().toISOString().split('T')[0];

    if (idx >= 0) {
      list[idx] = { ...list[idx], progress, status, lastReadAt: now };
    } else {
      list.push({ pathId, chapterId, status, progress, lastReadAt: now });
    }

    set({ learningProgress: list });
    storage.set('learningProgress', list);
  },

  updateLabProgress: (labId, completedSteps, totalSteps, status) => {
    const list = [...get().labProgress];
    const idx = list.findIndex(p => p.labId === labId);

    if (idx >= 0) {
      list[idx] = { ...list[idx], completedSteps, totalSteps, status, completedAt: status === 'completed' ? new Date().toISOString().split('T')[0] : list[idx].completedAt };
    } else {
      list.push({ labId, completedSteps, totalSteps, status, completedAt: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined });
    }

    set({ labProgress: list });
    storage.set('labProgress', list);
  },

  addStudyTime: (minutes) => {
    const user = get().user;
    if (!user) return;
    const updated = { ...user, totalStudyTime: user.totalStudyTime + minutes };
    set({ user: updated });
    storage.set('user', updated);
  },

  addExp: (exp) => {
    const user = get().user;
    if (!user) return;
    let newExp = user.exp + exp;
    let newLevel = user.level;
    const expPerLevel = 500;

    while (newExp >= newLevel * expPerLevel) {
      newExp -= newLevel * expPerLevel;
      newLevel++;
    }

    const updated = { ...user, exp: newExp, level: newLevel };
    set({ user: updated });
    storage.set('user', updated);
  },
}));
