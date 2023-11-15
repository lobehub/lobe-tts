import OpenAI from 'openai';

import { createOpenaiAudioTranscriptionsCompletion } from '../src/server/createOpenaiAudioTranscriptionsCompletion';
import { OpenAISTTPayload } from '../src/server/types';

export const config = {
  runtime: 'edge',
};

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const OPENAI_PROXY_URL = process.env.OPENAI_PROXY_URL;

  if (!OPENAI_API_KEY) return new Response('OPENAI_API_KEY is not set', { status: 500 });

  const payload = (await req.json()) as OpenAISTTPayload;

  const openai = new OpenAI({ apiKey: OPENAI_API_KEY, baseURL: OPENAI_PROXY_URL });
  const res = await createOpenaiAudioTranscriptionsCompletion({ openai, payload });

  return new Response(JSON.stringify(res), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
};
