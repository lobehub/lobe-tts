import OpenAI from 'openai';

import { OpenAITTSPayload } from './types';

interface CreateOpenaiAudioSpeechCompletionOptions {
  openai: OpenAI;
  payload: OpenAITTSPayload;
}

export const createOpenaiAudioSpeechCompletion = async ({
  payload,
  openai,
}: CreateOpenaiAudioSpeechCompletionOptions) => {
  const { options, input } = payload;

  const response = await openai.audio.speech.create(
    {
      input,
      model: options.model,
      voice: options.voice,
    },
    { headers: { Accept: '*/*' } },
  );

  return response;
};
