import { appendAuditEntry } from '@/lib/auditStore';
import { getPgKeyValue, setPgKeyValue } from '@/lib/postgres';
import type { StaffTask } from '@/lib/featurePack';

// Staff tasks live in the existing key-value store (entities table) under a
// reserved slug, so no schema migration is required.
const SLUG = 'staff-tasks';
type TaskPayload = { tasks: StaffTask[] };

export async function getTasks(): Promise<StaffTask[]> {
  const payload = await getPgKeyValue<TaskPayload>('entities', SLUG);
  return payload?.tasks ?? [];
}

export async function saveTasks(tasks: StaffTask[], action: string) {
  await setPgKeyValue<TaskPayload>('entities', SLUG, { tasks });
  await appendAuditEntry('Staff tasks', action);
}
