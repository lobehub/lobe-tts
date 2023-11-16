import useSWR, { type SWRConfiguration } from 'swr';

import { OpenAISTTPayload, OpenaiSTT } from '@/core/OpenAISTT';

export interface OpenAISTTCoreOptions extends OpenAISTTPayload, SWRConfiguration {
  api?: {
    key: string;
    url: string;
  };
  shouldFetch?: boolean;
}
export const useOpenAISTTCore = (config: OpenAISTTCoreOptions) => {
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
