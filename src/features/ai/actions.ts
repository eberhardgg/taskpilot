'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';

export async function completeBriefing(taskId: string, goal: string): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Update the task to be the ONE Thing
  await prisma.task.updateMany({
    where: { tier: 'one-thing' },
    data: { tier: 'supporting' },
  });

  await prisma.task.update({
    where: { id: taskId },
    data: { tier: 'one-thing' },
  });

  // Create or update today's daily review
  await prisma.dailyReview.upsert({
    where: { date: today },
    create: {
      date: today,
      oneThingId: taskId,
      oneThingGoal: goal,
    },
    update: {
      oneThingId: taskId,
      oneThingGoal: goal,
    },
  });

  revalidatePath('/');
}

export async function getTodaysBriefing() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.dailyReview.findUnique({
    where: { date: today },
  });
}
