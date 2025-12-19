'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useBriefing } from '../hooks/use-briefing';
import type { Task } from '@/features/tasks/types';

interface BriefingModalProps {
  tasks: Task[];
  isOpen: boolean;
  onClose: () => void;
}

export function BriefingModal({ tasks, isOpen, onClose }: BriefingModalProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, isLoading, isComplete, selectedTask, startBriefing, sendMessage, reset } =
    useBriefing(tasks);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      startBriefing();
    }
  }, [isOpen, messages.length, startBriefing]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isLoading) {
      inputRef.current?.focus();
    }
  }, [isOpen, isLoading]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  if (!isOpen) return null;

  // Clean display text (remove the parsing markers)
  function cleanMessage(content: string): string {
    return content.replace(/\[ONE_THING_SELECTED\][\s\S]*\[\/ONE_THING_SELECTED\]/g, '').trim();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-background rounded-xl shadow-2xl border border-foreground/10 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-foreground/10">
          <div>
            <h2 className="font-semibold">Morning Briefing</h2>
            <p className="text-xs text-foreground/50">Find your ONE Thing</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[85%] rounded-xl px-4 py-3
                  ${
                    message.role === 'user'
                      ? 'bg-foreground text-background'
                      : 'bg-foreground/5 border border-foreground/10'
                  }
                `}
              >
                {message.role === 'assistant' && (
                  <p className="text-xs font-medium text-foreground/50 mb-1">Chief of Staff</p>
                )}
                <p className="text-sm whitespace-pre-wrap">{cleanMessage(message.content)}</p>
              </div>
            </div>
          ))}

          {isLoading && messages.length === 0 && (
            <div className="flex justify-start">
              <div className="bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3">
                <p className="text-xs font-medium text-foreground/50 mb-1">Chief of Staff</p>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}

          {isComplete && selectedTask && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
              <p className="text-green-600 dark:text-green-400 font-medium">
                ONE Thing set: {selectedTask.title}
              </p>
              <Button onClick={handleClose} className="mt-3">
                Let&apos;s Go
              </Button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {!isComplete && (
          <form onSubmit={handleSubmit} className="p-4 border-t border-foreground/10">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Your response..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg border border-foreground/20 bg-background
                           placeholder:text-foreground/40 focus:outline-none focus:ring-2
                           focus:ring-foreground/20 transition-shadow disabled:opacity-50"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                Send
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
