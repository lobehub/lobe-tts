import cors from '../lib/cors';

export const config = {
  runtime: 'edge',
};

const API =
  'https://southeastasia.api.speech.microsoft.com/accfreetrial/texttospeech/acc/v3.0-beta1/vcg/speak';

const MICROSOFT_SPEECH_ALLOW_ORIGINS =
  process.env?.MICROSOFT_SPEECH_ALLOW_ORIGINS?.split(',') || undefined;

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  let origin = '*';

  if (MICROSOFT_SPEECH_ALLOW_ORIGINS) {
    const reqOrigin = req.headers.get('origin');
    if (reqOrigin && MICROSOFT_SPEECH_ALLOW_ORIGINS.includes(reqOrigin)) {
      origin = reqOrigin;
    } else {
      return new Response('Origin Not Allowed', { status: 403 });
    }
  }

  const res = await fetch(API, { body: req.body, headers: req.headers, method: 'POST' });
  const newResponse = new Response(res.body, res);

  return cors(req, newResponse, { methods: ['POST'], origin });
};
