import { NextRequest, NextResponse } from 'next/server';
import { patchTask } from '@/lib/featurePack';
import { requireSession } from '@/lib/requestAuth';
import { getTasks, saveTasks } from '@/lib/taskStore';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession(request);
  if (session instanceof NextResponse) return session;
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  const tasks = await getTasks();
  const existing = tasks.find((task) => task.id === id);
  if (!existing) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  try {
    const updated = patchTask(existing, body);
    await saveTasks(tasks.map((task) => (task.id === id ? updated : task)), `Task updated: ${updated.title}`);
    return NextResponse.json({ task: updated });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid update' }, { status: 422 });
  }
}
