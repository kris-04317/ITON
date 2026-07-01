export type LabDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface LabTask {
  id: string;
  description: string;
  verificationCommand?: string;
  expectedOutput?: string;
}

export interface LabStep {
  id: string;
  title: string;
  description: string;
  tasks: LabTask[];
  hint: string;
  order: number;
}

export interface Lab {
  id: string;
  title: string;
  description: string;
  difficulty: LabDifficulty;
  duration: number;
  completionRate: number;
  participantCount: number;
  image: string;
  tags: string[];
  steps: LabStep[];
}
