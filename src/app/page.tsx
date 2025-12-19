import { Suspense } from 'react';
import { AddTaskForm } from '@/features/tasks/components/add-task-form';
import { TaskList } from '@/features/tasks/components/task-list';
import { BriefingSection } from '@/features/ai/components/briefing-section';
import { getTasks } from '@/features/tasks/actions';

async function BriefingWithTasks() {
  const tasks = await getTasks();
  return <BriefingSection tasks={tasks} />;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-2xl px-4 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">TaskPilot</h1>
          <p className="text-foreground/60 mt-1">Find your ONE Thing. Execute what matters.</p>
        </header>

        <section className="mb-6">
          <Suspense fallback={null}>
            <BriefingWithTasks />
          </Suspense>
        </section>

        <section className="mb-8">
          <AddTaskForm />
        </section>

        <section>
          <Suspense
            fallback={<div className="text-center py-12 text-foreground/40">Loading tasks...</div>}
          >
            <TaskList />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
