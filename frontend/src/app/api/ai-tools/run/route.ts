import { requestWorkbenchAI, persistWorkbenchResult, workbenchError } from '@/lib/WorkbenchAIRuntime';
import { NextRequest, NextResponse } from 'next/server';
import { aiTools, getAITool } from '@/lib/aiTools';
import { appendAuditEntry } from '@/lib/auditStore';
import { requireSession } from '@/lib/requestAuth';

async function callConfiguredAI(system: string, prompt: string, signal: AbortSignal) { return requestWorkbenchAI(system, prompt, signal); }

export async function GET(request: NextRequest) {
  const session = await requireSession(request);
  if (session instanceof NextResponse) return session;
  return NextResponse.json({ tools: aiTools });
}

export async function POST(request: NextRequest) {
  const session = await requireSession(request);
  if (session instanceof NextResponse) return session;

  const body = await request.json().catch(() => null) as { toolId?: string; input?: string } | null;
  const tool = getAITool(body?.toolId || 'suite-assistant');
  const input = body?.input?.trim() || tool.defaultPrompt;
  const system = 'You are ' + tool.title + '. Stay inside this suite workflow. Return concise operational guidance with risks, next actions, and audit notes.';

  try {
    const ai = await requestWorkbenchAI(system, input, request.signal);
    request.signal.throwIfAborted();
    await appendAuditEntry('AI Tools', ((session.firstName + ' ' + session.lastName).trim() || session.email) + ' ran ' + tool.title);
    request.signal.throwIfAborted();
    return NextResponse.json({tool, input, response: ai.content, provider: 'openrouter', model: ai.model, providerReceipt: ai.providerReceipt, createdAt: new Date().toISOString()});
  } catch (error) { const failure = workbenchError(error, request.signal); return NextResponse.json({error: failure.error}, {status: failure.status}); }
}
