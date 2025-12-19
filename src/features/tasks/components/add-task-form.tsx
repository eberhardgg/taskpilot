'use client';

import { useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { createTask } from '../actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isLoading={pending} disabled={pending}>
      Add
    </Button>
  );
}

export function AddTaskForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await createTask(formData);
    formRef.current?.reset();
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex gap-3">
      <input
        type="text"
        name="title"
        placeholder="What needs to be done?"
        required
        className="flex-1 px-4 py-2 rounded-lg border border-foreground/20 bg-background
                   placeholder:text-foreground/40 focus:outline-none focus:ring-2
                   focus:ring-foreground/20 transition-shadow"
      />
      <SubmitButton />
    </form>
  );
}
