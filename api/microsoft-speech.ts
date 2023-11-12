import cors from '../src/server/cors';
import { getAllowOrigins } from '../src/server/getAllowOrigins';
import { handleMicrosoftSpeechRequest } from '../src/server/handleMicrosoftSpeechRequest';

export const config = {
  runtime: 'edge',
};

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const origin = getAllowOrigins(req);
  if (!origin) return new Response('Origin Not Allowed', { status: 403 });
  const res = await handleMicrosoftSpeechRequest(req);
  return cors(req, new Response(res.body, res), { methods: ['POST'], origin });
};
