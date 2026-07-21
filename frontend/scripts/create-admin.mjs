import { randomBytes, scryptSync } from 'node:crypto';
import pg from 'pg';
const databaseUrl = process.env.DATABASE_URL;
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const tenantId = process.env.DEFAULT_TENANT_ID || process.env.TENANT_ID;
const fullName = (process.env.ADMIN_NAME || process.env.BOOTSTRAP_ADMIN_NAME || 'Runtime Admin').trim();
if (!databaseUrl) throw new Error('DATABASE_URL is required');
if (!email || !email.includes('@')) throw new Error('ADMIN_EMAIL is required');
if (!password || password.length < 12) throw new Error('ADMIN_PASSWORD must contain at least 12 characters');
if (!tenantId) throw new Error('DEFAULT_TENANT_ID or TENANT_ID is required');
const [firstName, ...remainingName] = fullName.split(/\s+/), lastName = remainingName.join(' ') || 'Admin';
const salt = randomBytes(16).toString('hex'), n = 16384, r = 8, p = 1;
const derived = scryptSync(password, salt, 64, { N: n, r, p, maxmem: 64 * 1024 * 1024 });
const passwordHash = `scrypt$${n}$${r}$${p}$${salt}$${derived.toString('hex')}`;
const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();
try {
  await client.query(
    `INSERT INTO regulatory_app_users(email,password_hash,first_name,last_name,role,tenant_id,status,auth_source) VALUES($1,$2,$3,$4,'admin',$5,'active','local')
     ON CONFLICT(email) DO UPDATE SET password_hash=EXCLUDED.password_hash,first_name=EXCLUDED.first_name,last_name=EXCLUDED.last_name,role='admin',tenant_id=EXCLUDED.tenant_id,status='active',auth_source='local',updated_at=NOW()`,
    [email, passwordHash, firstName, lastName, tenantId],
  );
  process.stdout.write(`provisioned ${email}\n`);
} finally { await client.end(); }
