import { AZURE_SPEECH_PROXY_URL } from '@/const/api';
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
): Promise<AudioBufferSourceNode> => {
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

  const audioData = await response.arrayBuffer();
  const audioContext = new AudioContext();
  const audioBufferSource = audioContext.createBufferSource();
  audioBufferSource.buffer = await audioContext.decodeAudioData(audioData);
  audioBufferSource.connect(audioContext.destination);
  return audioBufferSource;
};
