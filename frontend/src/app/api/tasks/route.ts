import { NextRequest, NextResponse } from 'next/server';
import { createTask, filterRows } from '@/lib/featurePack';
import { requireSession } from '@/lib/requestAuth';
import { getTasks, saveTasks } from '@/lib/taskStore';

export async function GET(request: NextRequest) {
  const session = await requireSession(request);
  if (session instanceof NextResponse) return session;
  const tasks = await getTasks();
  const filtered = filterRows(tasks as unknown as Array<Record<string, unknown>>, {
    q: request.nextUrl.searchParams.get('q') || '',
    status: request.nextUrl.searchParams.get('status') || '',
  });
  return NextResponse.json({ tasks: filtered, total: filtered.length });
}

export async function POST(request: NextRequest) {
  const session = await requireSession(request);
  if (session instanceof NextResponse) return session;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  try {
    const task = createTask(body);
    const tasks = await getTasks();
    await saveTasks([task, ...tasks].slice(0, 500), `Task created: ${task.title}`);
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid task' }, { status: 422 });
  }
}
