import { useState } from 'react';
import useSWR from 'swr';

import { OpenaiSttOptions, fetchOpenaiSTT } from '@/services/fetchOpenaiSTT';
import { useAudioRecorder } from '@/useAudioRecorder';

export const useOpenaiSTT = (options: OpenaiSttOptions) => {
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const { start, stop, blob, url, isRecording, time, formattedTime } = useAudioRecorder(() => {
    setShouldFetch(true);
  });

  const key = new Date().getDate().toString();

  const { isLoading, data } = useSWR(
    shouldFetch && blob ? key : null,
    async () => await fetchOpenaiSTT(blob as any, options),
  );

  return {
    blob,
    formattedTime,
    isLoading: isLoading || isRecording,
    isRecording,
    start,
    stop,
    text: data,
    time,
    url,
  };
};
