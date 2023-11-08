import { MICROSOFT_SPEECH_PROXY_URL } from '@/const/api';
import { type SsmlOptions } from '@/utils/genSSML';
import { genSSML } from '@/utils/genSSML';

export interface MicrosoftSpeechOptions extends SsmlOptions {
  api?: string;
}

export const fetchMicrosoftSpeech = async (
  text: string,
  { api, ...options }: MicrosoftSpeechOptions,
): Promise<AudioBufferSourceNode> => {
  const data = JSON.stringify({
    offsetInPlainText: 0,
    properties: {
      SpeakTriggerSource: 'AccTuningPagePlayButton',
    },
    ssml: genSSML(text, options),
    ttsAudioFormat: 'audio-24khz-160kbitrate-mono-mp3',
  });

  const response: Response = await fetch(api || MICROSOFT_SPEECH_PROXY_URL, {
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
