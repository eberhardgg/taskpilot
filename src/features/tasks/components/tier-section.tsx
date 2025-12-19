import type { Task, TaskTier } from '../types';
import { TaskItem } from './task-item';

interface TierSectionProps {
  tier: TaskTier;
  tasks: Task[];
  title: string;
  description?: string;
  isHighlighted?: boolean;
}

export function TierSection({ tier, tasks, title, description, isHighlighted }: TierSectionProps) {
  if (tasks.length === 0 && tier !== 'one-thing') {
    return null;
  }

  return (
    <div
      className={`
        rounded-xl p-4 mb-4
        ${isHighlighted ? 'bg-foreground/5 border-2 border-foreground/20' : ''}
      `}
    >
      <div className="mb-3">
        <h2 className={`font-semibold ${isHighlighted ? 'text-lg' : 'text-sm text-foreground/60'}`}>
          {isHighlighted && <span className="mr-2">🎯</span>}
          {title}
        </h2>
        {description && <p className="text-xs text-foreground/40 mt-0.5">{description}</p>}
      </div>

      {tasks.length === 0 ? (
        <div
          className={`
            text-center py-8 rounded-lg border-2 border-dashed border-foreground/10
            text-foreground/30 text-sm
          `}
        >
          {tier === 'one-thing' ? (
            <>
              <p className="font-medium">No ONE Thing selected</p>
              <p className="text-xs mt-1">Promote a task to focus on what matters most</p>
            </>
          ) : (
            <p>No tasks</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} showTierSelect />
          ))}
        </div>
      )}
    </div>
  );
}
