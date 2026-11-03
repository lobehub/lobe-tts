import { afterEach, describe, expect, it, vi } from 'vitest';

import { GiggyTTS } from './index';

describe('GiggyTTS', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps the package payload to native Streaming TTS with authenticated headers', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(new Uint8Array([1, 2, 3])));
    vi.stubGlobal('fetch', fetchMock);

    const tts = new GiggyTTS({ apiKey: 'secret-test-key' });
    await tts.create({
      input: 'Hello from Lobe TTS',
      options: { voice: 'voice-uuid' },
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.giggy.ai/v1/text-to-speech');
    expect(request.method).toBe('POST');
    expect(new Headers(request.headers).get('xi-api-key')).toBe('secret-test-key');
    expect(new Headers(request.headers).get('Content-Type')).toBe('application/json');
    expect(JSON.parse(request.body)).toEqual({
      text: 'Hello from Lobe TTS',
      voice_id: 'voice-uuid',
      mode: 'streaming',
      model_id: 'giggyspeech',
      output_format: 'pcm_24000',
    });
  });

  it('maps streaming options and allows a server proxy URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(new Uint8Array([1, 2, 3])));
    vi.stubGlobal('fetch', fetchMock);

    const tts = new GiggyTTS({
      headers: { 'x-request-source': 'lobe-tts' },
      serviceUrl: 'https://app.example.com/api/giggy-tts',
    });
    await tts.create({
      input: 'Hola',
      options: {
        languageCode: 'es',
        mode: 'streaming',
        speed: 1.2,
        voice: 'voice-uuid',
      },
    });

    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toBe('https://app.example.com/api/giggy-tts');
    expect(new Headers(request.headers).get('x-request-source')).toBe('lobe-tts');
    expect(new Headers(request.headers).has('xi-api-key')).toBe(false);
    expect(JSON.parse(request.body)).toEqual({
      text: 'Hola',
      voice_id: 'voice-uuid',
      mode: 'streaming',
      model_id: 'giggyspeech',
      output_format: 'pcm_24000',
      voice_settings: { speed: 1.2 },
      language_code: 'es',
    });
  });

  it.each(['fast', 'batch'])(
    'rejects %s mode instead of selecting a non-streaming endpoint',
    async (mode) => {
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);
      await expect(
        new GiggyTTS().create({
          input: 'Hello',
          options: { mode, voice: 'voice-uuid' } as never,
        }),
      ).rejects.toThrow('Giggy TTS only supports Streaming mode.');
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it('rejects an API key alongside a custom proxy URL', () => {
    expect(
      () =>
        new GiggyTTS({
          apiKey: 'secret-test-key',
          serviceUrl: 'https://example.com/proxy',
        }),
    ).toThrow('Do not provide apiKey with serviceUrl');
  });

  it('rejects speed values outside the Giggy API range before making a request', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      new GiggyTTS().create({
        input: 'Hello',
        options: { speed: 4.1, voice: 'voice-uuid' },
      }),
    ).rejects.toThrow('Giggy TTS speed must be between 0.25 and 4.');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects non-finite speed values before making a request', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      new GiggyTTS().create({
        input: 'Hello',
        options: { speed: Number.NaN, voice: 'voice-uuid' },
      }),
    ).rejects.toThrow('Giggy TTS speed must be between 0.25 and 4.');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('requires streaming consumers to read the response body instead of decoding a full AudioBuffer', async () => {
    await expect(
      new GiggyTTS().createAudio({
        input: 'Hello',
        options: { voice: 'voice-uuid' },
      }),
    ).rejects.toThrow('consume create() response.body as a stream');
  });
});
