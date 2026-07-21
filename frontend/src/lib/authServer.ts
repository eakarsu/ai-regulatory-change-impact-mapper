import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import type { SessionUser } from '@/lib/auth';
import { ensurePostgres } from '@/lib/postgres';

type UserRow = { email: string; first_name: string; last_name: string; role: SessionUser['role']; tenant_id: string; password_hash?: string };
const sessionLifetimeMs = 8 * 60 * 60 * 1000;
const digest = (token: string) => createHash('sha256').update(token).digest('hex');
const toUser = (row: UserRow): SessionUser => ({ email: row.email, firstName: row.first_name, lastName: row.last_name, role: row.role, tenantId: row.tenant_id });

async function verifyPassword(password: string, encoded: string) {
  const [algorithm, nValue, rValue, pValue, salt, expected] = encoded.split('$');
  if (algorithm !== 'scrypt' || !salt || !expected) return false;
  const n = Number(nValue), r = Number(rValue), p = Number(pValue);
  if (n !== 16384 || r !== 8 || p !== 1) return false;
  const actual = await new Promise<Buffer>((resolve, reject) => {
    scryptCallback(password, salt, 64, { N: n, r, p, maxmem: 64 * 1024 * 1024 }, (error, value) => error ? reject(error) : resolve(value));
  });
  const expectedBytes = Buffer.from(expected, 'hex');
  return actual.length === expectedBytes.length && timingSafeEqual(actual, expectedBytes);
}

export async function authenticateUser(email: string, password: string): Promise<SessionUser | null> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) return null;
  const db = await ensurePostgres();
  const result = await db.query<UserRow>('SELECT email,first_name,last_name,role,tenant_id,password_hash FROM regulatory_app_users WHERE email=$1 AND status=\'active\'', [normalized]);
  const row = result.rows[0];
  return row?.password_hash && await verifyPassword(password, row.password_hash) ? toUser(row) : null;
}

export async function createSession(user: SessionUser) {
  const db = await ensurePostgres();
  await db.query(
    `INSERT INTO regulatory_app_users(email,first_name,last_name,role,tenant_id,status,auth_source)
     VALUES($1,$2,$3,$4,$5,'active','oidc')
     ON CONFLICT(email) DO UPDATE SET first_name=EXCLUDED.first_name,last_name=EXCLUDED.last_name,role=EXCLUDED.role,tenant_id=EXCLUDED.tenant_id,status='active',updated_at=NOW()`,
    [user.email.toLowerCase(), user.firstName, user.lastName, user.role, user.tenantId],
  );
  const token = randomBytes(32).toString('base64url');
  await db.query('INSERT INTO regulatory_app_sessions(token_hash,user_email,expires_at) VALUES($1,$2,$3)', [digest(token), user.email.toLowerCase(), new Date(Date.now() + sessionLifetimeMs)]);
  return token;
}

export async function getSessionUser(token?: string | null): Promise<SessionUser | null> {
  if (!token || token.length < 32 || token.length > 256) return null;
  const db = await ensurePostgres();
  const result = await db.query<UserRow>(
    `SELECT u.email,u.first_name,u.last_name,u.role,u.tenant_id FROM regulatory_app_sessions s JOIN regulatory_app_users u ON u.email=s.user_email WHERE s.token_hash=$1 AND s.expires_at>NOW() AND u.status='active'`,
    [digest(token)],
  );
  return result.rows[0] ? toUser(result.rows[0]) : null;
}

export async function revokeSession(token?: string | null) {
  if (!token || token.length < 32 || token.length > 256) return;
  const db = await ensurePostgres();
  await db.query('DELETE FROM regulatory_app_sessions WHERE token_hash=$1', [digest(token)]);
}
