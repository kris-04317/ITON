export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  signature: string;
  phone?: string;
  role?: string;
  level: number;
  exp: number;
  streakDays: number;
  totalStudyTime: number;
  createdAt: string;
}

export interface LearningProgress {
  pathId: string;
  chapterId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  lastReadAt: string;
}

export interface LabProgress {
  labId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completedSteps: number;
  totalSteps: number;
  bestTime?: number;
  completedAt?: string;
}
