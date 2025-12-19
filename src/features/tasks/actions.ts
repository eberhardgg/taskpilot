'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import type { Task } from './types';

export async function getTasks(): Promise<Task[]> {
  const tasks = await prisma.task.findMany({
    orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }],
  });

  return tasks.map((task) => ({
    ...task,
    tier: task.tier as Task['tier'],
  }));
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
