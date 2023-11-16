import { EdgeSpeechPayload } from '@/core';
import { createEdgeSpeech } from '@/core/EdgeSpeechTTS/createEdgeSpeech';

export const config = {
  runtime: 'edge',
};

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const payload = (await req.json()) as EdgeSpeechPayload;

  return createEdgeSpeech({ payload });
};
