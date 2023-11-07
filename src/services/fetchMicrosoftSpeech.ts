import qs from 'query-string';

import { MICROSOFT_SPEECH_PROXY_URL } from '@/const/api';

import { type SsmlOptions } from '../utils/genSSML';

export interface MicrosoftSpeechOptions extends SsmlOptions {
  api?: string;
}

export const fetchMicrosoftSpeech = async (
  text: string,
  { api, ...options }: MicrosoftSpeechOptions,
): Promise<AudioBufferSourceNode> => {
  const response: Response = await fetch(
    qs.stringifyUrl({
      query: { text, ...options },
      url: api || MICROSOFT_SPEECH_PROXY_URL,
    }),
  );

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
