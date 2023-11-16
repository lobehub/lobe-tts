import useSWR, { type SWRConfiguration } from 'swr';

import { OpenAISTTPayload, OpenaiSTT } from '@/core/OpenAISTT';

export interface OpenAISTTConfig extends OpenAISTTPayload, SWRConfiguration {
  api?: {
    key: string;
    url: string;
  };
  shouldFetch?: boolean;
}
export const useOpenaiSTT = (config: OpenAISTTConfig) => {
  const key = new Date().getDate().toString();
  const { shouldFetch, api, options, speech, ...swrConfig } = config;

  return useSWR(
    shouldFetch && speech ? key : null,
    async () => {
      const instance = new OpenaiSTT({
        apiKey: api?.key,
        baseUrl: api?.url,
      });

      return instance.create({ options, speech });
    },
    swrConfig,
  );
};
