import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { ensurePostgres } from '@/lib/postgres';
import { requireSession } from '@/lib/requestAuth';

const risks = new Set(['low','medium','high','critical']);
function digest(value: unknown) { return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex'); }
export async function POST(request: NextRequest) {
  const user = await requireSession(request); if (user instanceof NextResponse) return user;
  if (user.role !== 'analyst') return NextResponse.json({ error: 'Only analysts can evaluate regulatory impacts' }, { status: 403 });
  const body = await request.json().catch(() => null) as Record<string, any> | null;
  const citations = Array.isArray(body?.citations) ? body.citations : [];
  if (!body?.changeId || !body.scenarioId || !citations.length) return NextResponse.json({ error: 'Change, scenario and citations are required' }, { status: 400 });
  const tenant = user.tenantId;
  const db = await ensurePostgres(); const client = await db.connect();
  try {
    await client.query('BEGIN');
    const change = await client.query('SELECT id FROM regulatory_changes WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [body.changeId, tenant]); if (!change.rowCount) { await client.query('ROLLBACK'); return NextResponse.json({ error: 'Change not found' }, { status: 404 }); }
    const impacts = await client.query('SELECT * FROM regulatory_impacts WHERE change_id=$1 AND tenant_id=$2', [body.changeId, tenant]);
    const failures: string[] = [];
    if (!impacts.rowCount || impacts.rows.some(item => !item.owner_id || !item.obligation || !item.deadline || !risks.has(item.risk_rating))) failures.push('owned_obligations_deadlines_risk');
    if (citations.some((item: any) => !String(item.sourceUri || '').startsWith('https://') || !item.sourceVersion || !item.contentDigest || !item.locator)) failures.push('citations');
    for (const item of citations) if (!failures.includes('citations')) await client.query('INSERT INTO regulatory_citations(id,tenant_id,change_id,source_uri,source_version,content_digest,locator) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(change_id,source_uri,source_version,content_digest,locator) DO NOTHING', [crypto.randomUUID(), tenant, body.changeId, item.sourceUri, item.sourceVersion, item.contentDigest, item.locator]);
    const input = { impacts: impacts.rows, citations }; const inputDigest = digest(input); const result = { passed: failures.length === 0, failures, impacts: impacts.rows, citations };
    const inserted = await client.query('INSERT INTO scenario_evaluations(id,tenant_id,change_id,scenario_id,input_digest,passed,result) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(change_id,scenario_id,input_digest) DO NOTHING RETURNING *', [crypto.randomUUID(), tenant, body.changeId, body.scenarioId, inputDigest, result.passed, JSON.stringify(result)]);
    const evaluation = inserted.rowCount ? inserted.rows[0] : (await client.query('SELECT * FROM scenario_evaluations WHERE change_id=$1 AND scenario_id=$2 AND input_digest=$3', [body.changeId, body.scenarioId, inputDigest])).rows[0];
    await client.query('COMMIT'); return NextResponse.json(evaluation, { status: inserted.rowCount ? 201 : 200 });
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
}
