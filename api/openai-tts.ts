import OpenAI from 'openai';

import { OPENAI_API_KEY, OPENAI_PROXY_URL } from '@/const/api';

import { createOpenaiAudioSpeechCompletion } from '../src/server/createOpenaiAudioSpeechCompletion';
import { OpenAITTSPayload } from '../src/server/types';

export const config = {
  runtime: 'edge',
};

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const payload = (await req.json()) as OpenAITTSPayload;
  if (!OPENAI_API_KEY) return new Response('OPENAI_API_KEY is not set', { status: 500 });
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY, baseURL: OPENAI_PROXY_URL });
  const res = await createOpenaiAudioSpeechCompletion({ openai, payload });
  return res;
};
