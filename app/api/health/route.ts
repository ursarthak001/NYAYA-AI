import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.BHARATCODE_API_KEY;

  if (!apiKey || apiKey === 'your_bharatcode_api_key_here' || apiKey === 'test_bharatcode_key_demo') {
    return NextResponse.json({
      status: 'demo_mode',
      hasKey: false,
      message: 'No live key configured. Running in demo mode.',
    });
  }

  // Key is configured with prefix
  const keyPrefix = apiKey.slice(0, 7) + '...' + apiKey.slice(-4);

  return NextResponse.json({
    status: 'active',
    hasKey: true,
    model: 'qwen-3.8-27b',
    keyPreview: keyPrefix,
    message: 'BharatCode API key is active and loaded.',
  });
}
