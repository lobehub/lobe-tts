import { MicrosoftSpeechPayload, createMicrosoftSpeechComletion } from '@/index';

export const config = {
  runtime: 'edge',
};

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const payload = (await req.json()) as MicrosoftSpeechPayload;

  return createMicrosoftSpeechComletion({ payload });
};
