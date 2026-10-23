import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { buildRegulatoryInsights, createTask, filterRows, patchTask, toCsv } from './featurePack';

// Offline only: never set provider keys here; fallback must work without them.
delete process.env.OPENROUTER_API_KEY;
delete process.env.OPENAI_API_KEY;

test('search/filter keeps false and 0 values searchable', () => {
  const rows = [
    { id: 'a', name: 'Alpha rule', status: 'Open', amount: 0, verified: false },
    { id: 'b', name: 'Beta rule', status: 'Completed', amount: 75, verified: true },
  ];
  assert.equal(filterRows(rows, { q: 'alpha' }).length, 1);
  assert.equal(filterRows(rows, { q: 'false' }).length, 1);
  assert.equal(filterRows(rows, { status: 'Completed' }).length, 1);
  assert.equal(filterRows(rows, {}).length, 2);
});

test('csv export preserves false, 0 and empty columns', () => {
  const csv = toCsv([{ id: 'a', verified: false, amount: 0, note: '' }], ['id', 'verified', 'amount', 'note']);
  assert.equal(csv.split('\n')[1], 'a,false,0,');
});

test('tasks validate title and patch status strictly', () => {
  const task = createTask({ title: 'Review NY rule', priority: 'HIGH' }, new Date('2026-01-01T00:00:00Z'));
  assert.equal(task.status, 'OPEN');
  assert.equal(task.priority, 'HIGH');
  assert.throws(() => createTask({ title: ' ' }), /title is required/);
  assert.equal(patchTask(task, { status: 'DONE' }).status, 'DONE');
  assert.throws(() => patchTask(task, { status: 'DELETED' }), /OPEN, DONE, or CANCELLED/);
});

test('deterministic fallback reports aiGenerated false with zero counts intact', () => {
  const result = buildRegulatoryInsights([]);
  assert.equal(result.aiGenerated, false);
  assert.equal(result.features.length, 3);
  assert.equal(result.features[0].metrics.find((m) => m.label === 'Regulatory records')?.value, 0);
  for (const feature of result.features) assert.ok(feature.sections.some((s) => s.title === 'Limitations'));
});

test('tasks, export and insights routes exist behind auth', () => {
  assert.ok(existsSync('src/app/api/tasks/route.ts'));
  assert.ok(existsSync('src/app/api/tasks/[id]/route.ts'));
  assert.ok(existsSync('src/app/api/entities/[slug]/export/route.ts'));
  assert.ok(existsSync('src/app/api/ai/insights/route.ts'));
  assert.ok(readFileSync('src/app/api/tasks/route.ts', 'utf8').includes('requireSession'));
  assert.ok(readFileSync('src/app/api/ai/insights/route.ts', 'utf8').includes('requireSession'));
});
