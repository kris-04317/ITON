export type PathLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  estimatedTime: number;
  relatedLabId?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  cover: string;
  level: PathLevel;
  duration: number;
  chapterCount: number;
  studentCount: number;
  rating: number;
  category: string;
  tags: string[];
  chapters: Chapter[];
}
