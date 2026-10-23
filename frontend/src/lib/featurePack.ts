// Deterministic feature-pack helpers: search/filter, CSV export, task
// validation, and record-based insights with a labelled offline fallback
// (aiGenerated:false). Pure functions only — no provider or database calls.

export type PackRow = Record<string, unknown>;

export function filterRows(rows: PackRow[], options: { q?: string; status?: string } = {}): PackRow[] {
  const needle = String(options.q || '').trim().toLowerCase();
  const wanted = String(options.status || '').trim().toLowerCase();
  return (Array.isArray(rows) ? rows : []).filter((row) => {
    if (!row || typeof row !== 'object') return false;
    if (wanted) {
      const actual = String((row as Record<string, unknown>).status ?? (row as Record<string, unknown>).state ?? '').toLowerCase();
      if (actual !== wanted) return false;
    }
    if (!needle) return true;
    return Object.values(row).some((value) => {
      if (value === null || value === undefined) return false;
      const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
      return text.toLowerCase().includes(needle);
    });
  });
}

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const text = value instanceof Date ? value.toISOString() : typeof value === 'object' ? JSON.stringify(value) : String(value);
  return /[",\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
}

export function toCsv(rows: PackRow[], columns?: string[]): string {
  const list = Array.isArray(rows) ? rows : [];
  const cols = columns && columns.length ? columns : Object.keys(list[0] || { value: '' });
  return [cols.join(','), ...list.map((row) => cols.map((col) => csvCell(row?.[col])).join(','))].join('\n');
}

export type StaffTask = {
  id: string;
  title: string;
  status: 'OPEN' | 'DONE' | 'CANCELLED';
  priority: 'LOW' | 'NORMAL' | 'HIGH';
  dueAt: string | null;
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
};

export function parseTaskPriority(value: unknown): StaffTask['priority'] {
  return value === 'LOW' || value === 'HIGH' ? value : 'NORMAL';
}

export function parseTaskStatus(value: unknown): StaffTask['status'] | null {
  return value === 'OPEN' || value === 'DONE' || value === 'CANCELLED' ? value : null;
}

export function createTask(input: Record<string, unknown>, now = new Date()): StaffTask {
  const title = typeof input.title === 'string' ? input.title.trim() : '';
  if (!title) throw new Error('title is required');
  const dueAt = typeof input.dueAt === 'string' && !Number.isNaN(Date.parse(input.dueAt)) ? new Date(input.dueAt).toISOString() : null;
  return {
    id: `task-${now.getTime()}-${Math.floor(Math.random() * 1e6)}`,
    title: title.slice(0, 200),
    status: 'OPEN',
    priority: parseTaskPriority(input.priority),
    dueAt,
    assignee: typeof input.assignee === 'string' && input.assignee.trim() ? input.assignee.trim().slice(0, 120) : null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

export function patchTask(task: StaffTask, input: Record<string, unknown>, now = new Date()): StaffTask {
  const next: StaffTask = { ...task, updatedAt: now.toISOString() };
  if (input.status !== undefined) {
    const status = parseTaskStatus(input.status);
    if (!status) throw new Error('status must be OPEN, DONE, or CANCELLED');
    next.status = status;
  }
  if (typeof input.title === 'string' && input.title.trim()) next.title = input.title.trim().slice(0, 200);
  if (input.assignee === null || typeof input.assignee === 'string') next.assignee = input.assignee ? String(input.assignee).slice(0, 120) : null;
  if (input.priority !== undefined) next.priority = parseTaskPriority(input.priority);
  return next;
}

export function buildRegulatoryInsights(rows: Array<{ name?: string; status?: string; owner?: string; dueDate?: string; priority?: string }> = []) {
  const list = Array.isArray(rows) ? rows : [];
  const today = new Date().toISOString().slice(0, 10);
  const overdue = list.filter((r) => r.dueDate && r.dueDate < today && String(r.status || '').toLowerCase() !== 'completed').length;
  const unowned = list.filter((r) => !r.owner || !String(r.owner).trim()).length;
  const urgent = list.filter((r) => ['urgent', 'high', 'critical'].includes(String(r.priority || '').toLowerCase())).length;
  const features = [
    {
      feature: 'deadline-risk',
      title: 'Deadline and overdue risk',
      summary: `Scanned ${list.length} saved regulatory records; ${overdue} are past their due date and not completed.`,
      metrics: [
        { label: 'Regulatory records', value: list.length },
        { label: 'Overdue records', value: overdue },
        { label: 'Records without a due date', value: list.filter((r) => !r.dueDate).length },
      ],
      sections: [
        { title: 'Summary', detail: 'Overdue means a saved due date before today with a status other than Completed, including zero counts shown explicitly.' },
        { title: 'Findings', detail: overdue ? 'Overdue items need an owner decision before enforcement dates pass.' : 'No overdue records were found (overdue count 0).' },
        { title: 'Limitations', detail: 'Deterministic fallback over saved records only; it does not assess legal applicability.' },
      ],
      actions: ['Escalate overdue records to their owners.', 'Set due dates on undated records.'],
    },
    {
      feature: 'ownership-coverage',
      title: 'Ownership and evidence coverage',
      summary: `Found ${unowned} records without an owner out of ${list.length}.`,
      metrics: [
        { label: 'Records without an owner', value: unowned },
        { label: 'Urgent or high priority records', value: urgent },
        { label: 'Completed records', value: list.filter((r) => String(r.status || '').toLowerCase() === 'completed').length },
      ],
      sections: [
        { title: 'Summary', detail: 'Coverage counts saved owner and priority fields, including empty values.' },
        { title: 'Findings', detail: unowned ? 'Unowned records cannot progress; assign an accountable owner.' : 'Every saved record names an owner (unowned count 0).' },
        { title: 'Limitations', detail: 'Deterministic fallback over saved records only.' },
      ],
      actions: ['Assign owners to unowned records.', 'Review urgent records first.'],
    },
    {
      feature: 'impact-readiness',
      title: 'Impact-assessment readiness',
      summary: `${list.filter((r) => String(r.status || '').toLowerCase() === 'completed').length} of ${list.length} records are completed.`,
      metrics: [
        { label: 'Open or in-flight records', value: list.length - list.filter((r) => String(r.status || '').toLowerCase() === 'completed').length },
        { label: 'Records missing a status', value: list.filter((r) => !r.status).length },
      ],
      sections: [
        { title: 'Summary', detail: 'Readiness reflects saved statuses only; it does not confirm control mapping or policy updates.' },
        { title: 'Findings', detail: list.length ? 'In-flight records should be mapped to controls before deadlines.' : 'No regulatory records are saved yet (count 0).' },
        { title: 'Limitations', detail: 'Deterministic fallback over saved records only; not legal advice.' },
      ],
      actions: ['Map in-flight records to controls.', 'Give every record an explicit status.'],
    },
  ];
  return {
    aiGenerated: false as const,
    source: 'deterministic-fallback',
    disclaimer: 'Offline deterministic analysis of saved regulatory records. Not AI-generated and not legal advice.',
    features,
  };
}
