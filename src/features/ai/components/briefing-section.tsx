'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BriefingModal } from './briefing-modal';
import type { Task } from '@/features/tasks/types';

interface BriefingSectionProps {
  tasks: Task[];
}

export function BriefingSection({ tasks }: BriefingSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const incompleteTasks = tasks.filter((t) => !t.completed && t.tier !== 'one-thing');
  const hasOneThing = tasks.some((t) => t.tier === 'one-thing' && !t.completed);

  if (incompleteTasks.length === 0 && !hasOneThing) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-foreground/5 rounded-xl border border-foreground/10">
        <div>
          <p className="font-medium">
            {hasOneThing ? 'Your ONE Thing is set' : 'Ready to find your ONE Thing?'}
          </p>
          <p className="text-sm text-foreground/50">
            {hasOneThing
              ? 'You can start a new briefing to change it'
              : 'Start a briefing to identify your highest-impact task'}
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)} variant={hasOneThing ? 'secondary' : 'primary'}>
          {hasOneThing ? 'New Briefing' : 'Start Briefing'}
        </Button>
      </div>

      <BriefingModal tasks={tasks} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
