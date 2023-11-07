import qs from 'query-string';

import cors from '../lib/cors';
import { fetchMicrosoftSpeech } from '../lib/fetchMicrosoftSpeech';
import { SsmlOptions } from '../lib/genSSML';

export const config = {
  runtime: 'edge',
};

export default async (req: Request) => {
  const { text, ...options }: SsmlOptions & { text: string } = qs.parseUrl(req.url).query as any;

  const res = await fetchMicrosoftSpeech(text, options);

  const newResponse = new Response(res.body, res);

  return cors(req, newResponse);
};
