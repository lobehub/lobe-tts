import OpenAI from 'openai';

import type { OpenAISTTPayload } from '@/core/OpenAISTT';

export interface CreateOpenaiAudioTranscriptionsOptions {
  openai: OpenAI;
  payload: OpenAISTTPayload;
}

export const createOpenaiAudioTranscriptions = async ({
  payload,
  openai,
}: CreateOpenaiAudioTranscriptionsOptions) => {
  const { speech, options } = payload;

  const file = new File([speech], `${Date.now()}.${options.mineType.extension}`, {
    type: options.mineType.mineType,
  });

  const response = await openai.audio.transcriptions.create(
    {
      file,
      model: options.model,
      prompt: options.prompt || '',
    },
    { headers: { Accept: '*/*' } },
  );

  return response;
};
