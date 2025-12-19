import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

const anthropic = new Anthropic();

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface BriefingRequest {
  messages: Message[];
  tasks: { id: string; title: string; tier: string }[];
}

function buildSystemPrompt(tasks: BriefingRequest['tasks']): string {
  const taskList = tasks
    .filter((t) => t.tier !== 'one-thing')
    .map((t) => `- ${t.title}`)
    .join('\n');

  return `You are a Chief of Staff helping a busy professional identify their ONE Thing for today—the single task that would have the biggest impact.

Your role:
- Be warm but focused. This is a quick 2-4 exchange conversation, not a lengthy discussion.
- Help them identify which task would have the BIGGEST IMPACT if completed today.
- Ask probing questions to understand WHY a task matters and what goal it serves.
- Once they've identified their ONE Thing, confirm it and capture their goal/reasoning.

The user's current tasks:
${taskList || '(No tasks yet)'}

Conversation flow:
1. OPENING: Greet briefly, show their tasks, ask "Which of these would have the biggest impact today?"
2. PROBE (if needed): "What makes this the highest impact?" or "What goal does this move forward?"
3. CONFIRM: Once clear, confirm their choice and summarize their goal.
4. CLOSE: End with the exact format below so we can parse it.

IMPORTANT: When the user has confirmed their ONE Thing, you MUST end your message with this exact format:
[ONE_THING_SELECTED]
task: <exact task title from the list>
goal: <their stated goal/reason in one sentence>
[/ONE_THING_SELECTED]

Keep responses concise (2-4 sentences max until the closing).`;
}

export async function POST(request: NextRequest) {
  try {
    const body: BriefingRequest = await request.json();
    const { messages, tasks } = body;

    if (!tasks || tasks.length === 0) {
      return new Response(JSON.stringify({ error: 'No tasks provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = buildSystemPrompt(tasks);

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === 'content_block_delta') {
            const delta = event.delta;
            if ('text' in delta) {
              controller.enqueue(encoder.encode(delta.text));
            }
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Briefing API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process briefing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
