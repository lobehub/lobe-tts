import { EdgeSpeechPayload, createEdgeSpeechComletion } from '@lobehub/tts';

export const config = {
  runtime: 'edge',
};

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const payload = (await req.json()) as EdgeSpeechPayload;

  return createEdgeSpeechComletion({ payload });
};