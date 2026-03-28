import { MINIMAX_BASE_URL } from '@/core/const/api';
import { arrayBufferConvert } from '@/core/utils/arrayBufferConvert';

import voiceList, { type MiniMaxVoice, getMiniMaxVoiceOptions } from './voiceList';

export type { MiniMaxVoice } from './voiceList';

export interface MiniMaxTTSPayload {
  /**
   * @title Text to synthesize
   */
  input: string;
  options: {
    /**
     * @title TTS model
     * @default 'speech-2.8-hd'
     */
    model?: string;
    /**
     * @title Voice ID
     */
    voice: MiniMaxVoice;
  };
}

export interface MiniMaxTTSAPI {
  MINIMAX_API_KEY?: string;
  MINIMAX_PROXY_URL?: string;
  headers?: Headers;
  serviceUrl?: string;
}

interface MiniMaxTTSResponse {
  base_resp?: { status_code?: number; status_msg?: string };
  data?: { audio?: string };
}

export class MiniMaxTTS {
  private MINIMAX_BASE_URL: string;
  private MINIMAX_API_KEY: string | undefined;
  private serviceUrl: string | undefined;
  private headers?: Headers;

  constructor(api: MiniMaxTTSAPI = {}) {
    this.MINIMAX_BASE_URL = api.MINIMAX_PROXY_URL || MINIMAX_BASE_URL;
    this.MINIMAX_API_KEY = api.MINIMAX_API_KEY;
    this.serviceUrl = api.serviceUrl;
    this.headers = api.headers;
  }

  get voiceOptions() {
    return getMiniMaxVoiceOptions();
  }

  static voiceList = voiceList;

  /**
   * Convert hex-encoded audio string to ArrayBuffer
   */
  private hexToArrayBuffer(hex: string): ArrayBuffer {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes.buffer;
  }

  fetch = async (payload: MiniMaxTTSPayload) => {
    if (this.serviceUrl) {
      return fetch(this.serviceUrl, {
        body: JSON.stringify(payload),
        headers: this.headers,
        method: 'POST',
      });
    }

    const url = `${this.MINIMAX_BASE_URL}/t2a_v2`;

    const response = await fetch(url, {
      body: JSON.stringify({
        audio_setting: { format: 'mp3' },
        model: payload.options?.model || 'speech-2.8-hd',
        text: payload.input,
        voice_setting: { voice_id: payload.options.voice },
      }),
      headers: new Headers({
        'Authorization': `Bearer ${this.MINIMAX_API_KEY}`,
        'Content-Type': 'application/json',
      }),
      method: 'POST',
    });

    return response;
  };

  create = async (payload: MiniMaxTTSPayload): Promise<Response> => {
    const response = await this.fetch(payload);

    // When using serviceUrl, the proxy handles response format
    if (this.serviceUrl) return response;

    const json = (await response.json()) as MiniMaxTTSResponse;

    if (json.base_resp?.status_code !== 0 || !json.data?.audio) {
      throw new Error(
        `MiniMax TTS error: ${json.base_resp?.status_msg || 'No audio data returned'}`,
      );
    }

    // Convert hex-encoded audio to binary
    const audioBuffer = this.hexToArrayBuffer(json.data.audio);

    return new Response(audioBuffer, {
      headers: { 'Content-Type': 'audio/mpeg' },
      status: 200,
    });
  };

  createAudio = async (payload: MiniMaxTTSPayload): Promise<AudioBuffer> => {
    const response = await this.create(payload);

    const arrayBuffer = await response.arrayBuffer();
    return await arrayBufferConvert(arrayBuffer);
  };
}
