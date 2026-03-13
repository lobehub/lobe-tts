import type { CambAITTSPayload } from '../core/CambAITTS';

export interface CreateCambAIAudioSpeechOptions {
  apiKey: string;
  baseUrl?: string;
  payload: CambAITTSPayload;
}

export const createCambAIAudioSpeech = async ({
  payload,
  apiKey,
  baseUrl = 'https://client.camb.ai/apis',
}: CreateCambAIAudioSpeechOptions): Promise<Response> => {
  const { options, input } = payload;

  return fetch(`${baseUrl}/tts-stream`, {
    body: JSON.stringify({
      language: options.language || 'en-us',
      output_configuration: { format: options.format || 'mp3' },
      speech_model: options.speech_model || 'mars-flash',
      text: input,
      voice_id: options.voice_id,
    }),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    method: 'POST',
  });
};
