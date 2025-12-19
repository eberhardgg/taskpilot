'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { toggleTaskComplete, deleteTask, updateTaskTier } from '../actions';
import type { Task, TaskTier } from '../types';

const TIER_OPTIONS: { value: TaskTier; label: string }[] = [
  { value: 'one-thing', label: '🎯 ONE Thing' },
  { value: 'supporting', label: 'Supporting' },
  { value: 'if-time', label: 'If Time' },
  { value: 'backlog', label: 'Backlog' },
];

interface TaskItemProps {
  task: Task;
  showTierSelect?: boolean;
}

export function TaskItem({ task, showTierSelect = false }: TaskItemProps) {
  const [isToggling, startToggle] = useTransition();
  const [isDeleting, startDelete] = useTransition();
  const [isUpdatingTier, startUpdateTier] = useTransition();

  function handleToggle() {
    startToggle(() => {
      toggleTaskComplete(task.id);
    });
  }

  function handleDelete() {
    startDelete(() => {
      deleteTask(task.id);
    });
  }

  function handleTierChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newTier = e.target.value as TaskTier;
    startUpdateTier(() => {
      updateTaskTier(task.id, newTier);
    });
  }

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-lg border border-foreground/10
        transition-all duration-150
        ${task.completed ? 'bg-foreground/5 opacity-60' : 'bg-background'}
        ${isDeleting ? 'opacity-50 scale-95' : ''}
      `}
    >
      <button
        type="button"
        onClick={handleToggle}
        disabled={isToggling}
        className={`
          w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center
          transition-colors duration-150
          ${task.completed ? 'bg-foreground border-foreground' : 'border-foreground/30 hover:border-foreground/50'}
          ${isToggling ? 'opacity-50' : ''}
        `}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.completed && (
          <svg
            className="w-3 h-3 text-background"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${task.completed ? 'line-through' : ''}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-foreground/50 mt-0.5 truncate">{task.description}</p>
        )}
      </div>

      {showTierSelect && (
        <select
          value={task.tier}
          onChange={handleTierChange}
          disabled={isUpdatingTier}
          className={`
            text-xs px-2 py-1 rounded border border-foreground/10 bg-background
            focus:outline-none focus:ring-2 focus:ring-foreground/20
            ${isUpdatingTier ? 'opacity-50' : ''}
          `}
          aria-label="Change task tier"
        >
          {TIER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      <Button
        variant="ghost"
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 text-foreground/40 hover:text-red-500"
        aria-label="Delete task"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </Button>
    </div>
  );
}
