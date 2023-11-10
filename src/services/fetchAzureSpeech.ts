import { AZURE_SPEECH_PROXY_URL } from '@/const/api';
import { arrayBufferConvert } from '@/utils/arrayBufferConvert';
import { type SsmlOptions, genSSML } from '@/utils/genSSML';

export interface AzureSpeechOptions extends SsmlOptions {
  api: {
    key: string;
    region: string;
  };
}

export const fetchAzureSpeech = async (
  text: string,
  { api, ...options }: AzureSpeechOptions,
): Promise<AudioBuffer> => {
  const data = JSON.stringify({
    api,
    ssml: genSSML(text, options),
  });

  const response: Response = await fetch(AZURE_SPEECH_PROXY_URL, {
    body: data,
    method: 'POST',
    // @ts-ignore
    responseType: 'arraybuffer',
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const arrayBuffer = await response.arrayBuffer();
  return await arrayBufferConvert(arrayBuffer);
};
