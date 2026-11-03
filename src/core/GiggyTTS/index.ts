import { arrayBufferConvert } from '../utils/arrayBufferConvert';

export type GiggyTTSMode = 'batch' | 'fast';

export interface GiggyTTSPayload {
  input: string;
  options: {
    languageCode?: string;
    mode?: GiggyTTSMode;
    speed?: number;
    voice: string;
  };
}

export interface GiggyTTSAPI {
  apiKey?: string;
  headers?: HeadersInit;
  serviceUrl?: string;
}

const DEFAULT_BASE_URL = 'https://api.giggy.ai';

export class GiggyTTS {
  private apiKey?: string;
  private headers?: HeadersInit;
  private serviceUrl?: string;

  constructor({ apiKey, headers, serviceUrl }: GiggyTTSAPI = {}) {
    if (apiKey && serviceUrl) {
      throw new Error(
        'Do not provide apiKey with serviceUrl; authenticate in your server proxy.',
      );
    }

    this.apiKey = apiKey;
    this.headers = headers;
    this.serviceUrl = serviceUrl;
  }

  fetch = async ({ input, options }: GiggyTTSPayload): Promise<Response> => {
    if (
      options.speed !== undefined &&
      (!Number.isFinite(options.speed) ||
        options.speed < 0.25 ||
        options.speed > 4)
    ) {
      throw new Error('Giggy TTS speed must be between 0.25 and 4.');
    }

    const headers = new Headers(this.headers);
    headers.set('Content-Type', 'application/json');
    if (this.apiKey) headers.set('xi-api-key', this.apiKey);

    const body = {
      text: input,
      voice_id: options.voice,
      mode: options.mode || 'fast',
      model_id: 'giggyspeech',
      output_format: 'mp3_24000_160',
      ...(options.speed === undefined
        ? {}
        : { voice_settings: { speed: options.speed } }),
      ...(options.languageCode ? { language_code: options.languageCode } : {}),
    };

    return fetch(this.serviceUrl || `${DEFAULT_BASE_URL}/v1/text-to-speech`, {
      body: JSON.stringify(body),
      headers,
      method: 'POST',
    });
  };

  create = async (payload: GiggyTTSPayload): Promise<Response> =>
    this.fetch(payload);

  createAudio = async (payload: GiggyTTSPayload): Promise<AudioBuffer> => {
    const response = await this.create(payload);
    if (!response.ok) {
      const message = await response.text();
      throw new Error(
        `Giggy TTS request failed (${response.status}): ${message}`,
      );
    }

    return arrayBufferConvert(await response.arrayBuffer());
  };
}
