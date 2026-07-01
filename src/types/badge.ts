export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface SkillNode {
  id: string;
  name: string;
  level: 'not_started' | 'beginner' | 'intermediate' | 'advanced';
  progress: number;
  children?: SkillNode[];
}
