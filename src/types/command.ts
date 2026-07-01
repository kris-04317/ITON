export type CommandLevel = 'beginner' | 'intermediate' | 'advanced';

export interface CommandOption {
  flag: string;
  description: string;
}

export interface CommandExample {
  title: string;
  code: string;
  output?: string;
}

export interface Command {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  syntax: string;
  options: CommandOption[];
  combinations: string[];
  examples: CommandExample[];
  tips: string;
  level: CommandLevel;
}

export interface CommandCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  commandCount: number;
}
