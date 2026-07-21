import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { ensurePostgres } from '@/lib/postgres';
import { requireSession } from '@/lib/requestAuth';

const targets = new Set(['policy','control','product','contract','process','system']);
const risks = new Set(['low','medium','high','critical']);
export async function POST(request: NextRequest) {
  const user = await requireSession(request); if (user instanceof NextResponse) return user;
  if (user.role !== 'analyst') return NextResponse.json({ error: 'Only analysts can map regulatory impacts' }, { status: 403 });
  const body = await request.json().catch(() => null) as Record<string, any> | null;
  if (!body?.changeId || !targets.has(body.targetType) || !body.targetId || !body.ownerId || !body.obligation || !body.deadline || !Number.isFinite(Date.parse(body.deadline)) || !risks.has(body.riskRating)) return NextResponse.json({ error: 'Change, mapped target, owner, obligation, valid deadline and bounded risk are required' }, { status: 400 });
  const tenant = user.tenantId;
  const db = await ensurePostgres(); const change = await db.query('SELECT id FROM regulatory_changes WHERE id=$1 AND tenant_id=$2', [body.changeId, tenant]);
  if (!change.rowCount) return NextResponse.json({ error: 'Change not found' }, { status: 404 });
  const result = await db.query('INSERT INTO regulatory_impacts(id,tenant_id,change_id,target_type,target_id,owner_id,obligation,deadline,risk_rating) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *', [crypto.randomUUID(), tenant, body.changeId, body.targetType, body.targetId, body.ownerId, body.obligation, body.deadline, body.riskRating]);
  return NextResponse.json(result.rows[0], { status: 201 });
}
