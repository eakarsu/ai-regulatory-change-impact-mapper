'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { rolePermissions } from '@/lib/auth';
import type { EntityRecord, FeatureEntitySet } from '@/lib/featureEntities';

type Props = {
  slug: string;
  seed: FeatureEntitySet | null;
};

function cloneSet(set: FeatureEntitySet): FeatureEntitySet {
  return {
    title: set.title,
    columns: [...set.columns],
    rows: set.rows.map((row) => ({ ...row })),
  };
}

const STATUS_OPTIONS = ['Draft', 'Open', 'Queued', 'Review', 'Ready', 'In review', 'Approval pending', 'Urgent', 'Completed', 'Exception', 'Campaign active'];
const emptyRecordForm = { name: '', status: 'Open', owner: '', amount: '', dueDate: '' };

export default function EntityWorkspace({ slug, seed }: Props) {
  const { user } = useAuth();
  const permissions = rolePermissions[user?.role || 'analyst'];
  const canApprove = permissions.canApprove;
  const canManage = permissions.canManageDocuments;
  const seedSet = useMemo(() => (seed ? cloneSet(seed) : null), [seed]);
  const [dataset, setDataset] = useState<FeatureEntitySet | null>(seedSet);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(emptyRecordForm);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<EntityRecord | null>(null);
  const [rowDraft, setRowDraft] = useState<EntityRecord | null>(null);
  const [editingRow, setEditingRow] = useState(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const dirty = useRef(false);
  const [insights, setInsights] = useState<null | { aiGenerated: boolean; disclaimer: string; features: Array<{ feature: string; title: string; summary: string; metrics: Array<{ label: string; value: number }>; sections: Array<{ title: string; detail: string }>; actions: string[] }> }>(null);
  const [tasks, setTasks] = useState<Array<{ id: string; title: string; status: string }>>([]);
  const [taskTitle, setTaskTitle] = useState('');
  async function downloadExport(format: 'csv' | 'json') {
    const response = await fetch(`/api/entities/${slug}/export?format=${format}`);
    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `${slug}.${format}`;
    link.click(); URL.revokeObjectURL(url);
  }
  async function loadInsights() {
    const response = await fetch(`/api/ai/insights?slug=${encodeURIComponent(slug)}`);
    if (response.ok) setInsights(await response.json());
  }
  async function loadTasks() {
    const response = await fetch('/api/tasks');
    if (response.ok) { const data = await response.json(); setTasks(data.tasks || []); }
  }
  async function addTask() {
    if (!taskTitle.trim()) return;
    const response = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: taskTitle.trim() }) });
    if (response.ok) { setTaskTitle(''); void loadTasks(); }
  }
  async function toggleTask(id: string, status: string) {
    await fetch(`/api/tasks/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: status === 'DONE' ? 'OPEN' : 'DONE' }) });
    void loadTasks();
  }

  useEffect(() => {
    let active = true;
    async function load() {
      if (!seedSet) return;
      const response = await fetch(`/api/entities/${slug}`, { cache: 'no-store' });
      if (!response.ok) {
        if (active) {
          setDataset(seedSet);
          setLoaded(true);
        }
        return;
      }
      const payload = (await response.json()) as FeatureEntitySet;
      if (active) {
        setDataset(payload);
        setLoaded(true);
      }
    }
    void load().catch(() => {
      if (active) {
        setDataset(seedSet);
        setLoaded(true);
      }
    });
    return () => {
      active = false;
    };
  }, [seedSet, slug]);

  useEffect(() => {
    if (!dataset || !loaded || !dirty.current) return;
    if (!canManage) {
      setSaving(false);
      return;
    }
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    setSaving(true);
    saveTimeout.current = setTimeout(async () => {
      const response = await fetch(`/api/entities/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataset),
      });
      if (!response.ok) {
        setError('Unable to save changes for this role.');
      } else {
        dirty.current = false;
        setError('');
      }
      setSaving(false);
    }, 350);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [canManage, dataset, loaded, slug]);

  if (!dataset) return null;

  const filtered = dataset.rows.filter((row) =>
    !query ||
    row.name.toLowerCase().includes(query.toLowerCase()) ||
    row.owner.toLowerCase().includes(query.toLowerCase()) ||
    (row.status ?? '').toLowerCase().includes(query.toLowerCase()),
  );

  const removeRow = (id: string) => {
    if (!canManage) return;
    dirty.current = true;
    setDataset((current) =>
      current
        ? {
            ...current,
            rows: current.rows.filter((row) => row.id !== id),
          }
        : current,
    );
  };

  const openRow = (row: EntityRecord) => {
    setSelectedRow(row);
    setRowDraft({ ...row });
    setEditingRow(false);
  };

  const saveRow = () => {
    if (!canManage || !rowDraft) return;
    dirty.current = true;
    setDataset((current) => current ? {
      ...current,
      rows: current.rows.map((row) => row.id === rowDraft.id ? { ...rowDraft } : row),
    } : current);
    setSelectedRow({ ...rowDraft });
    setEditingRow(false);
  };

  const deleteSelectedRow = () => {
    if (!canManage || !selectedRow) return;
    removeRow(selectedRow.id);
    setSelectedRow(null);
    setRowDraft(null);
    setEditingRow(false);
  };

  const addRow = () => {
    if (!canManage) return;
    if (!form.name.trim()) return;
    dirty.current = true;
    const row: EntityRecord = {
      id: `entity-${Date.now()}`,
      name: form.name.trim(),
      status: form.status || 'Open',
      owner: form.owner.trim() || 'Unassigned',
      amount: form.amount.trim() || '$0',
      dueDate: form.dueDate.trim() || '',
    };
    setDataset((current) => (current ? { ...current, rows: [row, ...current.rows] } : current));
    setForm(emptyRecordForm);
    setShowAddModal(false);
  };

  const reset = async () => {
    const response = await fetch(`/api/entities/${slug}`, { method: 'DELETE' });
    if (!response.ok) return;
    const payload = (await response.json()) as FeatureEntitySet;
    setDataset(payload);
  };

  const applyApproval = async (id: string, approved: boolean) => {
    if (!canApprove) return;
    const response = await fetch(`/api/entities/${slug}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rowId: id, approved }),
    });
    if (!response.ok) {
      setError('Approval action failed.');
      return;
    }
    const payload = (await response.json()) as { row: EntityRecord };
    setDataset((current) =>
      current
        ? {
            ...current,
            rows: current.rows.map((row) => (row.id === id ? payload.row : row)),
          }
        : current,
    );
    setSelectedRow((current) => current?.id === id ? payload.row : current);
    setRowDraft((current) => current?.id === id ? { ...payload.row } : current);
    setError('');
  };

  return (
    <div className="card">
      <h3>{dataset.title}</h3>
      <div className="toolbar-row">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search records" />
        <span className="save-indicator">{saving ? 'Saving...' : 'Saved'}</span>
        <div className="muted">{canManage ? 'Edit mode' : 'Read-only mode'}</div>
        <button className="button subtle" type="button" onClick={() => void downloadExport('csv')}>Export CSV</button>
        <button className="button subtle" type="button" onClick={() => void downloadExport('json')}>Export JSON</button>
        <button className="button subtle" type="button" onClick={() => void loadInsights()}>Record insights</button>
        <button className="button subtle" type="button" onClick={reset} disabled={!canManage}>Reset records</button>
        <button
          className="button primary"
          type="button"
          onClick={() => {
            setForm(emptyRecordForm);
            setShowAddModal(true);
          }}
          disabled={!canManage}
        >
          Add record
        </button>
      </div>
      {error ? <div style={{ color: '#b91c1c', marginTop: 8 }}>{error}</div> : null}
      {insights ? (
        <section aria-label="Record insights" style={{ marginTop: 12 }}>
          <h4>Record insights</h4>
          <p className="muted">{insights.disclaimer} · aiGenerated: {String(insights.aiGenerated)}</p>
          {insights.features.map((feature) => (
            <article key={feature.feature} style={{ marginTop: 10 }}>
              <h5>{feature.title}</h5>
              <p>{feature.summary}</p>
              <dl>{feature.metrics.map((metric) => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}</dl>
              {feature.sections.map((section) => <div key={section.title}><h6>{section.title}</h6><p>{section.detail}</p></div>)}
              <h6>Suggested actions</h6>
              <ol>{feature.actions.map((action) => <li key={action}>{action}</li>)}</ol>
            </article>
          ))}
        </section>
      ) : null}
      <section aria-label="Follow-up tasks" style={{ marginTop: 12 }}>
        <h4>Follow-up tasks</h4>
        <div className="toolbar-row">
          <input aria-label="New task title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="New follow-up task" />
          <button className="button subtle" type="button" onClick={() => void addTask()}>Add task</button>
          <button className="button subtle" type="button" onClick={() => void loadTasks()}>Load tasks</button>
        </div>
        <ul>{tasks.map((task) => <li key={task.id}>{task.title} — {task.status} <button className="button subtle" type="button" onClick={() => void toggleTask(task.id, task.status)}>{task.status === 'DONE' ? 'Reopen' : 'Mark done'}</button></li>)}</ul>
      </section>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr
                key={row.id}
                className="clickable-data-row"
                tabIndex={0}
                onClick={() => openRow(row)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openRow(row);
                  }
                }}
              >
                <td><strong>{row.name}</strong></td>
                <td><span className="status-chip">{row.status}</span></td>
                <td>{row.owner}</td>
                <td>{row.amount || '$0'}</td>
                <td>{row.dueDate || 'Not set'}</td>
                <td><button className="button subtle" type="button" onClick={(event) => { event.stopPropagation(); openRow(row); }}>Open</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal ? (
        <div className="record-modal-backdrop" role="presentation" onClick={() => setShowAddModal(false)}>
          <div className="record-modal" role="dialog" aria-modal="true" aria-label={'Add ' + dataset.title + ' record'} onClick={(event) => event.stopPropagation()}>
            <button className="record-modal-close" type="button" aria-label="Close add record dialog" onClick={() => setShowAddModal(false)}>
              <X size={18} aria-hidden="true" />
            </button>
            <div className="record-modal-header">
              <div>
                <span className="eyebrow">Add Record</span>
                <h2>{dataset.title}</h2>
                <p>Create a complete record with status, owner, amount, and due date.</p>
              </div>
            </div>
            <div className="record-form-grid">
              <label className="record-form-field span-2">
                <span>Name</span>
                <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="Record name" autoFocus />
              </label>
              <label className="record-form-field">
                <span>Status</span>
                <select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>
              <label className="record-form-field">
                <span>Owner</span>
                <input value={form.owner} onChange={(e) => setForm((s) => ({ ...s, owner: e.target.value }))} placeholder="Owner" />
              </label>
              <label className="record-form-field">
                <span>Amount</span>
                <input value={form.amount} onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))} placeholder="Amount" />
              </label>
              <label className="record-form-field">
                <span>Due Date</span>
                <input type="date" value={form.dueDate} onChange={(e) => setForm((s) => ({ ...s, dueDate: e.target.value }))} />
              </label>
            </div>
            <div className="record-modal-actions">
              <button className="button secondary" type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="button primary" type="button" onClick={addRow} disabled={!form.name.trim()}>Save record</button>
            </div>
          </div>
        </div>
      ) : null}

      {selectedRow && rowDraft ? (
        <div className="record-modal-backdrop" role="presentation" onClick={() => setSelectedRow(null)}>
          <div className="record-modal" role="dialog" aria-modal="true" aria-label={dataset.title + ' record details'} onClick={(event) => event.stopPropagation()}>
            <button className="record-modal-close" type="button" aria-label="Close record dialog" onClick={() => setSelectedRow(null)}>
              <X size={18} aria-hidden="true" />
            </button>
            <div className="record-modal-header">
              <div>
                <span className="eyebrow">{editingRow ? 'Edit Record' : 'Record Details'}</span>
                <h2>{selectedRow.name}</h2>
                <p>Stored in PostgreSQL and protected by role-based change permissions.</p>
              </div>
            </div>
            <div className="record-form-grid">
              <label className="record-form-field span-2">
                <span>Name</span>
                <input value={rowDraft.name} disabled={!editingRow} onChange={(event) => setRowDraft((current) => current ? { ...current, name: event.target.value } : current)} />
              </label>
              <label className="record-form-field">
                <span>Status</span>
                <select value={rowDraft.status} disabled={!editingRow} onChange={(event) => setRowDraft((current) => current ? { ...current, status: event.target.value } : current)}>
                  {STATUS_OPTIONS.map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
              <label className="record-form-field">
                <span>Owner</span>
                <input value={rowDraft.owner} disabled={!editingRow} onChange={(event) => setRowDraft((current) => current ? { ...current, owner: event.target.value } : current)} />
              </label>
              <label className="record-form-field">
                <span>Amount</span>
                <input value={rowDraft.amount || ''} disabled={!editingRow} onChange={(event) => setRowDraft((current) => current ? { ...current, amount: event.target.value } : current)} />
              </label>
              <label className="record-form-field">
                <span>Due Date</span>
                <input type="date" value={rowDraft.dueDate || ''} disabled={!editingRow} onChange={(event) => setRowDraft((current) => current ? { ...current, dueDate: event.target.value } : current)} />
              </label>
            </div>
            <div className="record-modal-actions">
              {canApprove ? <button className="button secondary" type="button" onClick={() => applyApproval(selectedRow.id, true)}>Approve</button> : null}
              {canApprove ? <button className="button secondary" type="button" onClick={() => applyApproval(selectedRow.id, false)}>Reject</button> : null}
              <button className="button primary" type="button" disabled={!canManage} onClick={() => editingRow ? saveRow() : setEditingRow(true)}>{editingRow ? 'Save changes' : 'Edit'}</button>
              <button className="button danger" type="button" disabled={!canManage} onClick={deleteSelectedRow}>Delete</button>
              <button className="button secondary" type="button" onClick={() => setSelectedRow(null)}>Cancel</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
