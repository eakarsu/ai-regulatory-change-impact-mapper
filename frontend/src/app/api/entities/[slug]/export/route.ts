import { NextRequest, NextResponse } from 'next/server';
import { getEntitySet } from '@/lib/entityStore';
import { filterRows, toCsv } from '@/lib/featurePack';
import { requireSession } from '@/lib/requestAuth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await requireSession(request);
  if (session instanceof NextResponse) return session;
  const { slug } = await params;
  const set = await getEntitySet(slug);
  if (!set) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const format = (request.nextUrl.searchParams.get('format') || 'json').toLowerCase();
  if (format !== 'csv' && format !== 'json') return NextResponse.json({ error: 'format must be csv or json' }, { status: 422 });
  const rows = filterRows(set.rows as unknown as Array<Record<string, unknown>>, {
    q: request.nextUrl.searchParams.get('q') || '',
    status: request.nextUrl.searchParams.get('status') || '',
  });
  if (format === 'csv') {
    return new Response(toCsv(rows, ['id', 'name', 'status', 'owner', 'amount', 'dueDate', 'priority']), {
      headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${slug}.csv"` },
    });
  }
  return new Response(JSON.stringify(rows, null, 2), {
    headers: { 'Content-Type': 'application/json', 'Content-Disposition': `attachment; filename="${slug}.json"` },
  });
}
