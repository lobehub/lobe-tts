import { useState } from 'react';
import useSWR from 'swr';

import { arrayBufferConvert } from '@/utils/arrayBufferConvert';
import { playAudioBlob } from '@/utils/playAudioBlob';

export const useBlobUrl = (src: string) => {
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [url, setUrl] = useState<string>();
  const [blob, setBlob] = useState<Blob>();
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const { isLoading } = useSWR(
    src,
    async () => {
      const data = await fetch(src);
      if (!data) return;
      const buffer = await data.arrayBuffer();
      return await arrayBufferConvert(buffer);
    },
    {
      onSuccess: (data) => {
        if (!data || data.size === 0) return;
        if (audio) audio.remove();
        if (url) URL.revokeObjectURL(url);
        setBlob(data);
        const newAudio = playAudioBlob(data);
        setUrl(newAudio.url);
        setAudio(newAudio.audio);
        setIsGlobalLoading(false);
      },
    },
  );

  return {
    audio,
    blob,
    isLoading: isGlobalLoading || isLoading,
    url,
  };
};
