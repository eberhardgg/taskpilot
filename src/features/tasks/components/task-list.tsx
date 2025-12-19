import { getTasksByTier } from '../actions';
import { TierSection } from './tier-section';

export async function TaskList() {
  const tasksByTier = await getTasksByTier();

  const hasAnyTasks =
    tasksByTier['one-thing'].length > 0 ||
    tasksByTier['supporting'].length > 0 ||
    tasksByTier['if-time'].length > 0 ||
    tasksByTier['backlog'].length > 0;

  if (!hasAnyTasks) {
    return (
      <div className="text-center py-12 text-foreground/40">
        <p className="text-lg">No tasks yet</p>
        <p className="text-sm mt-1">Add your first task above</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <TierSection
        tier="one-thing"
        tasks={tasksByTier['one-thing']}
        title="YOUR ONE THING"
        description="The single most important task for today"
        isHighlighted
      />

      <TierSection
        tier="supporting"
        tasks={tasksByTier['supporting']}
        title="Supporting Tasks"
        description="Tasks that support your ONE Thing"
      />

      <TierSection
        tier="if-time"
        tasks={tasksByTier['if-time']}
        title="If Time Permits"
        description="Nice to do, but not essential"
      />

      <TierSection
        tier="backlog"
        tasks={tasksByTier['backlog']}
        title="Backlog"
        description="Tasks to prioritize later"
      />
    </div>
  );
}
