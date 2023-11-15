import useSWR, { type SWRConfiguration } from 'swr';

import { OpenaiSttOptions, fetchOpenaiSTT } from '@/services/fetchOpenaiSTT';
import { getRecordMineType } from '@/utils/getRecordMineType';

export const useOpenaiSTT = (
  shouldFetch?: boolean,
  blob?: Blob,
  options?: OpenaiSttOptions,
  config?: SWRConfiguration,
) => {
  const key = new Date().getDate().toString();

  const optionsWithMineType: OpenaiSttOptions = { ...options, mineType: getRecordMineType() };

  return useSWR(
    shouldFetch && blob ? key : null,
    async () => await fetchOpenaiSTT(blob as Blob, optionsWithMineType),
    config,
  );
};
