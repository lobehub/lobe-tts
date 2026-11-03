import { type Dispatch, type SetStateAction, useState } from 'react';

import {
  GiggyTTS,
  type GiggyTTSAPI,
  type GiggyTTSPayload,
} from '@/core/GiggyTTS';
import { type TTSOptions, type TTSResponse, useTTS } from '@/react/useTTS';

export interface GiggyTTSOptions
  extends Pick<GiggyTTSPayload, 'options'>, TTSOptions {
  api?: Omit<GiggyTTSAPI, 'apiKey'>;
}

export const useGiggyTTS = (
  defaultText: string,
  init: GiggyTTSOptions,
): TTSResponse & {
  response: Response | undefined;
  setText: Dispatch<SetStateAction<string>>;
} => {
  const [text, setText] = useState<string>(defaultText);
  const { options, api, ...swrConfig } = init;
  if (api && 'apiKey' in api) {
    throw new Error(
      'useGiggyTTS cannot accept apiKey; authenticate in your server proxy.',
    );
  }
  const [response, setResponse] = useState<Response>();
  const rest = useTTS(
    options.voice,
    text,
    async (segmentText: string) => {
      const instance = new GiggyTTS(api);
      const res = await instance.create({ input: segmentText, options });
      setResponse(res);
      if (!res.ok) {
        const message = await res.text();
        throw new Error(`Giggy TTS request failed (${res.status}): ${message}`);
      }
      return res.arrayBuffer();
    },
    swrConfig,
  );
  return {
    response,
    setText,
    ...rest,
  };
};
