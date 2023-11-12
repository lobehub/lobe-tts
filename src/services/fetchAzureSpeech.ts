import { AZURE_SPEECH_KEY, AZURE_SPEECH_PROXY_URL, AZURE_SPEECH_REGION } from '@/const/api';
import { arrayBufferConvert } from '@/utils/arrayBufferConvert';
import { type SsmlOptions, genSSML } from '@/utils/genSSML';

export interface AzureSpeechOptions extends SsmlOptions {
  api?: {
    key?: string;
    proxy?: string;
    region?: string;
  };
}

export const fetchAzureSpeech = async (
  text: string,
  { api = {}, ...options }: AzureSpeechOptions,
): Promise<AudioBuffer> => {
  const data = JSON.stringify({
    api: {
      key: api?.key || AZURE_SPEECH_KEY,
      region: api?.region || AZURE_SPEECH_REGION,
    },
    ssml: genSSML(text, options),
  });
  const url = api?.proxy || AZURE_SPEECH_PROXY_URL;

  const response: Response = await fetch(url, {
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
