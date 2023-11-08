// TODO: fix vercel error
// Error: The Edge Function "api/azure-speech" is referencing unsupported modules:
// - https-proxy-agent: net, tls, url
// - microsoft-cognitiveservices-speech-sdk: vc-blob-asset:speech-processor.js, fs, net, tls

/*
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
*/

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  return new Response('WIP');
};
