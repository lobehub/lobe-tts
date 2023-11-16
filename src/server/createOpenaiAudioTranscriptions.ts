import OpenAI from 'openai';

import { OpenAISTTPayload } from '@/core/OpenAISTT';

interface CreateOpenaiAudioTranscriptionsOptions {
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
    },
    { headers: { Accept: '*/*' } },
  );

  return response;
};
