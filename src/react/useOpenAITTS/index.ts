import { type Dispatch, type SetStateAction, useState } from 'react';

import { OpenAITTS, type OpenAITTSAPI, type OpenAITTSPayload } from '@/core/OpenAITTS';
import { type TTSOptions, type TTSResponse, useTTS } from '@/react/useTTS';

export interface OpenAITTSOptions extends Pick<OpenAITTSPayload, 'options'>, TTSOptions {
  api?: OpenAITTSAPI;
}

export const useOpenAITTS = (
  defaultText: string,
  init: OpenAITTSOptions,
): TTSResponse & {
  response: Response | undefined;
  setText: Dispatch<SetStateAction<string>>;
} => {
  const [text, setText] = useState<string>(defaultText);
  const { options, api, ...swrConfig } = init;
  const [response, setResponse] = useState<Response>();
  const rest = useTTS(
    options.voice,
    text,
    async (segmentText: string) => {
      const instance = new OpenAITTS(api);
      const res = await instance.create({ input: segmentText, options });
      setResponse(res);
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
