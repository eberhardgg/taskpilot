export type TaskTier = 'one-thing' | 'supporting' | 'if-time' | 'backlog';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  tier: TaskTier;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date | null;
  estimatedMinutes: number | null;
}
