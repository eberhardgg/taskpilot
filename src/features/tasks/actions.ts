'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import type { Task, TaskTier } from './types';

const TIER_ORDER: Record<TaskTier, number> = {
  'one-thing': 0,
  supporting: 1,
  'if-time': 2,
  backlog: 3,
};

export async function getTasks(): Promise<Task[]> {
  const tasks = await prisma.task.findMany({
    orderBy: [{ createdAt: 'desc' }],
  });

  return tasks
    .map((task) => ({
      ...task,
      tier: task.tier as Task['tier'],
    }))
    .sort((a, b) => {
      // Sort by tier first, then by completion status
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
    });
}

export async function getTasksByTier(): Promise<Record<TaskTier, Task[]>> {
  const tasks = await getTasks();

  const grouped: Record<TaskTier, Task[]> = {
    'one-thing': [],
    supporting: [],
    'if-time': [],
    backlog: [],
  };

  for (const task of tasks) {
    grouped[task.tier].push(task);
  }

  return grouped;
}

export async function createTask(formData: FormData): Promise<void> {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string | null;

  if (!title?.trim()) {
    throw new Error('Title is required');
  }

  await prisma.task.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      tier: 'backlog',
    },
  });

  revalidatePath('/');
}

export async function toggleTaskComplete(id: string): Promise<void> {
  const task = await prisma.task.findUnique({ where: { id } });

  if (!task) {
    throw new Error('Task not found');
  }

  await prisma.task.update({
    where: { id },
    data: { completed: !task.completed },
  });

  revalidatePath('/');
}

export async function deleteTask(id: string): Promise<void> {
  await prisma.task.delete({ where: { id } });
  revalidatePath('/');
}

export async function updateTaskTier(id: string, tier: TaskTier): Promise<void> {
  // If setting as ONE Thing, clear any existing ONE Thing first
  if (tier === 'one-thing') {
    await prisma.task.updateMany({
      where: { tier: 'one-thing' },
      data: { tier: 'supporting' },
    });
  }

  await prisma.task.update({
    where: { id },
    data: { tier },
  });

  revalidatePath('/');
}
