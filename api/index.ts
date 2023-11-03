import qs from 'query-string';

import cors from '../src/cors';
import { SsmlOptions } from '../src/genSSML';
import { postMicrosoftSpeech } from '../src/index';

export const config = {
  runtime: 'edge',
};

export default async (req: Request) => {
  const { text, ...options }: SsmlOptions & { text: string } = qs.parseUrl(req.url).query as any;

  const res = await fetch(...postMicrosoftSpeech(text, options));

  const headers = new Headers(res.headers);

  res.headers = headers;
  
  return cors(req, res);
};
