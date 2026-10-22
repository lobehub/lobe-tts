import useSWR, { type SWRConfiguration, type SWRResponse } from 'swr';

import { OpenaiSTT, type OpenAISTTAPI, type OpenAISTTPayload } from '@/core/OpenAISTT';

export interface OpenAISTTCoreOptions extends OpenAISTTPayload, SWRConfiguration {
  api?: OpenAISTTAPI;
  shouldFetch?: boolean;
}
export const useOpenAISTTCore = (init: OpenAISTTCoreOptions): SWRResponse<Response> => {
  const key = new Date().getDate().toString();
  const { shouldFetch, api, options, speech, ...swrConfig } = init;

  return useSWR(
    shouldFetch && speech ? key : null,
    async () => {
      const instance = new OpenaiSTT(api);
      return instance.create({ options, speech });
    },
    swrConfig,
  );
};
