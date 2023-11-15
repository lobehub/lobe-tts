import OpenAI from 'openai';

import { OpenAISTTPayload } from './types';

interface CreateOpenaiAudioTranscriptionsOptions {
  openai: OpenAI;
  payload: OpenAISTTPayload;
}

export const createOpenaiAudioTranscriptionsCompletion = async ({
  payload,
  openai,
}: CreateOpenaiAudioTranscriptionsOptions) => {
  const { blob, options } = payload;

  const file = new File([blob], `${Date.now()}.${options.mineType.extension}`, {
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
