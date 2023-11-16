import OpenAI from 'openai';

import { OpenAITTSPayload } from '@/core';

import { createOpenaiAudioSpeech } from '../src/server/createOpenaiAudioSpeech';

export const config = {
  runtime: 'edge',
};

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL;

  if (!OPENAI_API_KEY) return new Response('OPENAI_API_KEY is not set', { status: 500 });

  const payload = (await req.json()) as OpenAITTSPayload;

  const openai = new OpenAI({ apiKey: OPENAI_API_KEY, baseURL: OPENAI_BASE_URL });

  return createOpenaiAudioSpeech({ openai, payload });
};
