import { getTasks } from '../actions';
import { TaskItem } from './task-item';

export async function TaskList() {
  const tasks = await getTasks();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-foreground/40">
        <p className="text-lg">No tasks yet</p>
        <p className="text-sm mt-1">Add your first task above</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
