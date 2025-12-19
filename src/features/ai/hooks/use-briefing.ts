'use client';

import { useState, useCallback } from 'react';
import { completeBriefing } from '../actions';
import type { Task } from '@/features/tasks/types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface BriefingResult {
  taskTitle: string;
  goal: string;
}

function parseOneThingSelection(text: string): BriefingResult | null {
  const match = text.match(
    /\[ONE_THING_SELECTED\]\s*task:\s*([\s\S]+?)\s*goal:\s*([\s\S]+?)\s*\[\/ONE_THING_SELECTED\]/
  );
  if (match) {
    return {
      taskTitle: match[1].trim(),
      goal: match[2].trim(),
    };
  }
  return null;
}

export function useBriefing(tasks: Task[]) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const startBriefing = useCallback(async () => {
    setIsLoading(true);
    setMessages([]);
    setIsComplete(false);
    setSelectedTask(null);

    try {
      const response = await fetch('/api/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Start my morning briefing.' }],
          tasks: tasks.map((t) => ({ id: t.id, title: t.title, tier: t.tier })),
        }),
      });

      if (!response.ok) throw new Error('Failed to start briefing');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      let assistantMessage = '';
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantMessage += decoder.decode(value, { stream: true });
        setMessages([{ role: 'assistant', content: assistantMessage }]);
      }

      // Check if briefing is complete
      const result = parseOneThingSelection(assistantMessage);
      if (result) {
        const task = tasks.find((t) => t.title.toLowerCase() === result.taskTitle.toLowerCase());
        if (task) {
          setSelectedTask(task);
          setIsComplete(true);
          await completeBriefing(task.id, result.goal);
        }
      }
    } catch (error) {
      console.error('Briefing error:', error);
      setMessages([
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [tasks]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (isLoading || isComplete) return;

      const newMessages: Message[] = [...messages, { role: 'user', content }];
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const response = await fetch('/api/briefing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages,
            tasks: tasks.map((t) => ({ id: t.id, title: t.title, tier: t.tier })),
          }),
        });

        if (!response.ok) throw new Error('Failed to send message');

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        let assistantMessage = '';
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantMessage += decoder.decode(value, { stream: true });
          setMessages([...newMessages, { role: 'assistant', content: assistantMessage }]);
        }

        // Check if briefing is complete
        const result = parseOneThingSelection(assistantMessage);
        if (result) {
          const task = tasks.find((t) => t.title.toLowerCase() === result.taskTitle.toLowerCase());
          if (task) {
            setSelectedTask(task);
            setIsComplete(true);
            await completeBriefing(task.id, result.goal);
          }
        }
      } catch (error) {
        console.error('Briefing error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, tasks, isLoading, isComplete]
  );

  const reset = useCallback(() => {
    setMessages([]);
    setIsLoading(false);
    setIsComplete(false);
    setSelectedTask(null);
  }, []);

  return {
    messages,
    isLoading,
    isComplete,
    selectedTask,
    startBriefing,
    sendMessage,
    reset,
  };
}
