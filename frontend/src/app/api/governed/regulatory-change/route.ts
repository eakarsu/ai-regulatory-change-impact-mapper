import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { ensurePostgres } from '@/lib/postgres';
import { requireSession } from '@/lib/requestAuth';

const transitions: Record<string, string[]> = {
  detected: ['triaged', 'dismissed'], triaged: ['assessment_in_progress', 'dismissed'],
  assessment_in_progress: ['approval_pending', 'needs_information'], needs_information: ['assessment_in_progress'],
  approval_pending: ['approved', 'needs_information', 'rejected'], approved: ['published'],
  published: ['remediation_in_progress', 'superseded'], remediation_in_progress: ['remediated', 'published'],
};
const grants: Record<string, string[]> = {
  analyst: ['detected:triaged', 'triaged:assessment_in_progress', 'assessment_in_progress:approval_pending', 'needs_information:assessment_in_progress'],
  manager: ['assessment_in_progress:needs_information', 'approval_pending:approved', 'approval_pending:needs_information', 'approval_pending:rejected'],
  admin: ['approved:published', 'published:remediation_in_progress', 'remediation_in_progress:remediated', 'remediation_in_progress:published'],
};
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') { const map = value as Record<string, unknown>; return `{${Object.keys(map).sort().map(key => `${JSON.stringify(key)}:${canonical(map[key])}`).join(',')}}`; }
  return JSON.stringify(value);
}

export async function GET(request: NextRequest) {
  const user = await requireSession(request); if (user instanceof NextResponse) return user;
  if (!['manager', 'admin'].includes(user.role)) return NextResponse.json({ error: 'Audit export requires manager or administrator role' }, { status: 403 });
  const db = await ensurePostgres();
  const result = await db.query('SELECT d.id,d.change_id,d.from_status,d.to_status,d.actor_id,d.actor_role,d.rationale,d.impact_snapshot,d.occurred_at FROM regulatory_decisions d WHERE d.tenant_id=$1 ORDER BY d.occurred_at DESC,d.id DESC LIMIT 1000', [user.tenantId]);
  return NextResponse.json({ tenantId: user.tenantId, exportedAt: new Date().toISOString(), records: result.rows }, { headers: { 'Cache-Control': 'no-store', 'Content-Disposition': 'attachment; filename="regulatory-audit.json"' } });
}

export async function POST(request: NextRequest) {
  const user = await requireSession(request); if (user instanceof NextResponse) return user;
  if (user.role !== 'analyst') return NextResponse.json({ error: 'Only analysts can ingest regulatory changes' }, { status: 403 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const required = ['sourceId', 'sourceUri', 'publisher', 'jurisdiction', 'effectiveAt', 'publishedAt', 'retrievedAt', 'sourceVersion', 'content', 'ownerId'];
  const dateFields = ['effectiveAt', 'publishedAt', 'retrievedAt'];
  if (!body || required.some(key => !body[key]) || !String(body.sourceUri).startsWith('https://') || dateFields.some(key => !Number.isFinite(Date.parse(String(body[key]))))) {
    return NextResponse.json({ error: 'Authoritative versioned HTTPS source, valid dates, jurisdiction, content, and owner required' }, { status: 400 });
  }
  const id = crypto.randomUUID();
  const contentDigest = crypto.createHash('sha256').update(canonical(body.content)).digest('hex');
  const provenance = { sourceId: body.sourceId, sourceUri: body.sourceUri, publisher: body.publisher, jurisdiction: body.jurisdiction, effectiveAt: body.effectiveAt, publishedAt: body.publishedAt, retrievedAt: body.retrievedAt, sourceVersion: body.sourceVersion };
  const db = await ensurePostgres();
  const inserted = await db.query(
    'INSERT INTO regulatory_changes(id,tenant_id,source_id,source_uri,publisher,jurisdiction,effective_at,published_at,retrieved_at,source_version,content_digest,source_provenance,owner_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) ON CONFLICT(tenant_id,source_id,source_version,content_digest) DO NOTHING RETURNING *',
    [id, user.tenantId, body.sourceId, body.sourceUri, body.publisher, body.jurisdiction, body.effectiveAt, body.publishedAt, body.retrievedAt, body.sourceVersion, contentDigest, JSON.stringify(provenance), body.ownerId],
  );
  if (inserted.rowCount) return NextResponse.json({ ...inserted.rows[0], changeKind: 'created' }, { status: 201 });
  const replay = await db.query('SELECT * FROM regulatory_changes WHERE tenant_id=$1 AND source_id=$2 AND source_version=$3 AND content_digest=$4', [user.tenantId, body.sourceId, body.sourceVersion, contentDigest]);
  return NextResponse.json({ ...replay.rows[0], changeKind: 'unchanged' });
}

export async function PATCH(request: NextRequest) {
  const user = await requireSession(request); if (user instanceof NextResponse) return user;
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body?.id || !body.rationale || String(body.rationale).length < 8) return NextResponse.json({ error: 'ID and meaningful rationale required' }, { status: 400 });
  const db = await ensurePostgres(); const client = await db.connect();
  try {
    await client.query('BEGIN');
    const found = await client.query('SELECT * FROM regulatory_changes WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [body.id, user.tenantId]);
    if (!found.rowCount) { await client.query('ROLLBACK'); return NextResponse.json({ error: 'Change not found' }, { status: 404 }); }
    const item = found.rows[0];
    if (body.action === 'set_records_control') {
      if (user.role !== 'admin' || typeof body.legalHold !== 'boolean') { await client.query('ROLLBACK'); return NextResponse.json({ error: 'Administrator and legal-hold state required' }, { status: 403 }); }
      if (body.retainUntil && !Number.isFinite(Date.parse(String(body.retainUntil)))) { await client.query('ROLLBACK'); return NextResponse.json({ error: 'Valid retention date required' }, { status: 400 }); }
      const updated = await client.query('UPDATE regulatory_changes SET legal_hold=$1,retain_until=$2,updated_at=NOW() WHERE id=$3 AND tenant_id=$4 RETURNING *', [body.legalHold, body.retainUntil || null, item.id, user.tenantId]);
      await client.query('INSERT INTO regulatory_decisions(tenant_id,change_id,from_status,to_status,actor_id,actor_role,rationale,impact_snapshot) VALUES($1,$2,$3,$4,$5,$6,$7,$8)', [user.tenantId, item.id, item.status, item.status, user.email, user.role, body.rationale, JSON.stringify({ event: 'records_control_changed', legalHold: body.legalHold, retainUntil: body.retainUntil || null })]);
      await client.query('COMMIT'); return NextResponse.json(updated.rows[0]);
    }
    if (!body.toStatus) { await client.query('ROLLBACK'); return NextResponse.json({ error: 'Target status required' }, { status: 400 }); }
    const edge = `${item.status}:${body.toStatus}`;
    if (!transitions[item.status]?.includes(String(body.toStatus)) || !grants[user.role]?.includes(edge)) { await client.query('ROLLBACK'); return NextResponse.json({ error: 'Forbidden transition' }, { status: 403 }); }
    if (['approved', 'published'].includes(String(body.toStatus)) && (user.email === item.owner_id || user.email === item.assessor_id)) { await client.query('ROLLBACK'); return NextResponse.json({ error: 'Segregation of duties violation' }, { status: 409 }); }
    if (['approval_pending', 'approved', 'published'].includes(String(body.toStatus))) {
      const evaluation = await client.query('SELECT passed FROM scenario_evaluations WHERE change_id=$1 AND tenant_id=$2 ORDER BY evaluated_at DESC LIMIT 1', [item.id, user.tenantId]);
      if (!evaluation.rows[0]?.passed) { await client.query('ROLLBACK'); return NextResponse.json({ error: 'A passing scenario evaluation is required' }, { status: 409 }); }
    }
    const impacts = await client.query('SELECT * FROM regulatory_impacts WHERE change_id=$1 AND tenant_id=$2 ORDER BY id', [item.id, user.tenantId]);
    const updated = await client.query("UPDATE regulatory_changes SET status=$1,assessor_id=CASE WHEN $1='approval_pending' THEN $2 ELSE assessor_id END,approver_id=CASE WHEN $1 IN('approved','published') THEN $2 ELSE approver_id END,version=version+1,updated_at=NOW() WHERE id=$3 AND tenant_id=$4 RETURNING *", [body.toStatus, user.email, item.id, user.tenantId]);
    await client.query('INSERT INTO regulatory_decisions(tenant_id,change_id,from_status,to_status,actor_id,actor_role,rationale,impact_snapshot) VALUES($1,$2,$3,$4,$5,$6,$7,$8)', [user.tenantId, item.id, item.status, body.toStatus, user.email, user.role, body.rationale, JSON.stringify(impacts.rows)]);
    await client.query('COMMIT'); return NextResponse.json(updated.rows[0]);
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}
