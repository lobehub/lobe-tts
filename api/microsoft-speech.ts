import cors from '../lib/cors';
import {
  MicrosoftSpeechPayload,
  createMicrosoftSpeech,
} from '../src/core/MicrosoftSpeechTTS/createMicrosoftSpeech';

export const config = {
  runtime: 'edge',
};

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const payload = (await req.json()) as MicrosoftSpeechPayload;

  const res = await createMicrosoftSpeech({ payload });

  return cors(req, res);
};
