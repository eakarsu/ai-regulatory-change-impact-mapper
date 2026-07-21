const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:5207';
const entitySlug = 'regulatory-watchlist';
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
if (!adminEmail || !adminPassword) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');

async function login(email, password) {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error(`Login failed for ${email}`);
  const cookie = response.headers.get('set-cookie');
  if (!cookie) throw new Error(`No session cookie for ${email}`);
  return cookie.split(';')[0];
}

async function expectStatus(path, cookie, status) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { cookie },
  });
  if (response.status !== status) {
    throw new Error(`${path} returned ${response.status}, expected ${status}`);
  }
  return response;
}

async function expectJson(path, cookie, status = 200) {
  const response = await expectStatus(path, cookie, status);
  return response.json();
}

const adminCookie = await login(adminEmail, adminPassword);

await expectJson('/api/dashboard', adminCookie);
await expectJson(`/api/entities/${entitySlug}`, adminCookie);
await expectJson('/api/documents', adminCookie);
await expectJson('/api/source-tables', adminCookie);
await expectStatus('/api/documents/upload', adminCookie, 405);

const records = await expectJson(`/api/entities/${entitySlug}`, adminCookie);
const rowId = records.rows[0].id;

const approveResponse = await fetch(`${baseUrl}/api/entities/${entitySlug}/approve`, {
  method: 'POST',
  headers: {
    cookie: adminCookie,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ rowId, approved: true }),
});
if (!approveResponse.ok) throw new Error(`Admin approval failed with ${approveResponse.status}`);

console.log('Regulatory change mapper smoke passed');
