import { NextRequest, NextResponse } from 'next/server';
import { getEntitySet } from '@/lib/entityStore';
import { buildRegulatoryInsights } from '@/lib/featurePack';
import { requireSession } from '@/lib/requestAuth';

// Record-based insights over the mapper's own saved entity records.
// Without a provider key this returns the labelled deterministic fallback
// (aiGenerated:false); no provider call is made in that case.
export async function GET(request: NextRequest) {
  const session = await requireSession(request);
  if (session instanceof NextResponse) return session;
  const slug = request.nextUrl.searchParams.get('slug') || 'regulatory-watchlist';
  const set = await getEntitySet(slug);
  if (!set) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const fallback = buildRegulatoryInsights(set.rows);
  return NextResponse.json({
    ...fallback,
    slug,
    providerConfigured: Boolean(process.env.OPENROUTER_API_KEY),
    note: process.env.OPENROUTER_API_KEY
      ? 'Deterministic record insights shown; use AI Tools for provider-generated drafts.'
      : 'No provider key configured, so the deterministic fallback is shown. Not legal advice.',
  });
}
