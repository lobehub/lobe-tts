import cors from '../src/server/cors';
import { getAllowOrigins } from '../src/server/getAllowOrigins';
import { handleAzureSpeechRequest } from '../src/server/handleAzureSpeechRequest';

export const config = {
  runtime: 'edge',
};

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const origin = getAllowOrigins(req);
  if (!origin) return new Response('Origin Not Allowed', { status: 403 });
  const res = await handleAzureSpeechRequest(req);
  return cors(req, res, { methods: ['POST'], origin });
};
