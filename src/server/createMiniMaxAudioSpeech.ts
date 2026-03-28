import type { MiniMaxTTSPayload } from '../core/MiniMaxTTS';

export interface CreateMiniMaxAudioSpeechOptions {
  apiKey: string;
  baseUrl?: string;
  payload: MiniMaxTTSPayload;
}

export const createMiniMaxAudioSpeech = async ({
  payload,
  apiKey,
  baseUrl,
}: CreateMiniMaxAudioSpeechOptions): Promise<Response> => {
  const { options, input } = payload;
  const url = `${baseUrl || 'https://api.minimax.io/v1'}/t2a_v2`;

  const response = await fetch(url, {
    body: JSON.stringify({
      audio_setting: { format: 'mp3' },
      model: options.model || 'speech-2.8-hd',
      text: input,
      voice_setting: { voice_id: options.voice },
    }),
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const json = (await response.json()) as {
    base_resp?: { status_code?: number; status_msg?: string };
    data?: { audio?: string };
  };

  if (json.base_resp?.status_code !== 0 || !json.data?.audio) {
    throw new Error(`MiniMax TTS error: ${json.base_resp?.status_msg || 'No audio data returned'}`);
  }

  // Convert hex-encoded audio to binary
  const hex = json.data.audio;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
  }

  return new Response(bytes, {
    headers: { 'Content-Type': 'audio/mpeg' },
    status: 200,
  });
};
