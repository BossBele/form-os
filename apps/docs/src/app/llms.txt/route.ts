import { NextResponse } from 'next/server';
import { generateLlmsTxt } from '../../lib/llms-txt';

export async function GET() {
  return new NextResponse(generateLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
