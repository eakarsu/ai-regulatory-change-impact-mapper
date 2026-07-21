import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is required');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const migrationDir = path.join(root, 'migrations');
const files = (await fs.readdir(migrationDir)).filter((name) => name.endsWith('.sql')).sort();
const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();
try {
  for (const file of files) {
    await client.query(await fs.readFile(path.join(migrationDir, file), 'utf8'));
    process.stdout.write(`applied ${file}\n`);
  }
} finally { await client.end(); }
