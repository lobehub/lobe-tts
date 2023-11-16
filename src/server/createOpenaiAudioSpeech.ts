import OpenAI from 'openai';

import { OpenAITTSPayload } from '../core/OpenAITTS';

interface CreateOpenaiAudioSpeechCompletionOptions {
  openai: OpenAI;
  payload: OpenAITTSPayload;
}

export const createOpenaiAudioSpeech = async ({
  payload,
  openai,
}: CreateOpenaiAudioSpeechCompletionOptions) => {
  const { options, input } = payload;

  return openai.audio.speech.create(
    {
      input,
      model: options.model,
      voice: options.voice,
    },
    { headers: { Accept: '*/*' } },
  );
};
