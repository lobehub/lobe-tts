import useSWR, { type SWRConfiguration } from 'swr';

import { OpenaiSttOptions, fetchOpenaiSTT } from '@/services/fetchOpenaiSTT';
import { getRecordMineType } from '@/utils/getRecordMineType';

export type OpenaiSTTFetcher = (blob: Blob, sttOptions: OpenaiSttOptions) => Promise<string>;
export const useOpenaiSTT = (
  shouldFetch?: boolean,
  blob?: Blob,
  options?: OpenaiSttOptions,
  config?: SWRConfiguration,
  fetcher?: OpenaiSTTFetcher,
) => {
  const key = new Date().getDate().toString();

  const optionsWithMineType: OpenaiSttOptions = { ...options, mineType: getRecordMineType() };

  const openaiSTTFetcher = fetcher ?? fetchOpenaiSTT;

  return useSWR(
    shouldFetch && blob ? key : null,
    async () => await openaiSTTFetcher(blob as Blob, optionsWithMineType),
    config,
  );
};
