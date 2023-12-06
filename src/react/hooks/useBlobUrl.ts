import { useState } from 'react';
import useSWR from 'swr';

import { arrayBufferConvert } from '@/core/utils/arrayBufferConvert';
import { audioBufferToBlob } from '@/core/utils/audioBufferToBlob';
import { playAudioBlob } from '@/core/utils/playAudioBlob';

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
      onSuccess: async (data) => {
        if (!data) return;
        const blob = await audioBufferToBlob(data);
        if (!blob || blob.size === 0) return;
        if (audio) audio.remove();
        if (url) URL.revokeObjectURL(url);
        setBlob(blob);
        try {
          const newAudio = playAudioBlob(blob);
          setUrl(newAudio.url);
          setAudio(newAudio.audio);
        } catch {}
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
