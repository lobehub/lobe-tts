import { MiniMaxTTSPayload } from '@/core';

import cors from '../lib/cors';
import { createMiniMaxAudioSpeech } from '../src/server/createMiniMaxAudioSpeech';

export const config = {
  runtime: 'edge',
};

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
  const MINIMAX_BASE_URL = process.env.MINIMAX_BASE_URL;

  if (!MINIMAX_API_KEY) return new Response('MINIMAX_API_KEY is not set', { status: 500 });

  const payload = (await req.json()) as MiniMaxTTSPayload;

  const res = await createMiniMaxAudioSpeech({
    apiKey: MINIMAX_API_KEY,
    baseUrl: MINIMAX_BASE_URL,
    payload,
  });

  return cors(req, res);
};
