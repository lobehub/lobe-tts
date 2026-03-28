import { describe, expect, it, vi } from 'vitest';

import { createMiniMaxAudioSpeech } from '@/server/createMiniMaxAudioSpeech';

describe('createMiniMaxAudioSpeech', () => {
  it('should call MiniMax API and return audio Response', async () => {
    const hexAudio = '48656c6c6f'; // "Hello"
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          base_resp: { status_code: 0 },
          data: { audio: hexAudio },
        }),
      ),
    );
    vi.stubGlobal('fetch', mockFetch);

    const res = await createMiniMaxAudioSpeech({
      apiKey: 'test-key',
      payload: {
        input: 'Hello',
        options: { voice: 'English_Graceful_Lady' },
      },
    });

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('audio/mpeg');

    const buffer = await res.arrayBuffer();
    expect(new TextDecoder().decode(buffer)).toBe('Hello');

    vi.unstubAllGlobals();
  });

  it('should use custom baseUrl', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          base_resp: { status_code: 0 },
          data: { audio: 'aabb' },
        }),
      ),
    );
    vi.stubGlobal('fetch', mockFetch);

    await createMiniMaxAudioSpeech({
      apiKey: 'test-key',
      baseUrl: 'https://custom.proxy/v1',
      payload: {
        input: 'Test',
        options: { voice: 'cute_boy' },
      },
    });

    expect(mockFetch.mock.calls[0][0]).toBe('https://custom.proxy/v1/t2a_v2');

    vi.unstubAllGlobals();
  });

  it('should default model to speech-2.8-hd', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          base_resp: { status_code: 0 },
          data: { audio: 'aabb' },
        }),
      ),
    );
    vi.stubGlobal('fetch', mockFetch);

    await createMiniMaxAudioSpeech({
      apiKey: 'test-key',
      payload: {
        input: 'Test',
        options: { voice: 'Deep_Voice_Man' },
      },
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.model).toBe('speech-2.8-hd');
    expect(body.voice_setting.voice_id).toBe('Deep_Voice_Man');
    expect(body.audio_setting.format).toBe('mp3');

    vi.unstubAllGlobals();
  });

  it('should throw on API error response', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          base_resp: { status_code: 1002, status_msg: 'Rate limit exceeded' },
        }),
      ),
    );
    vi.stubGlobal('fetch', mockFetch);

    await expect(
      createMiniMaxAudioSpeech({
        apiKey: 'test-key',
        payload: {
          input: 'Test',
          options: { voice: 'sweet_girl' },
        },
      }),
    ).rejects.toThrow('MiniMax TTS error: Rate limit exceeded');

    vi.unstubAllGlobals();
  });

  it('should include proper Authorization header', async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          base_resp: { status_code: 0 },
          data: { audio: 'aabb' },
        }),
      ),
    );
    vi.stubGlobal('fetch', mockFetch);

    await createMiniMaxAudioSpeech({
      apiKey: 'my-api-key',
      payload: {
        input: 'Test',
        options: { voice: 'Wise_Woman' },
      },
    });

    const headers = mockFetch.mock.calls[0][1].headers;
    expect(headers['Authorization']).toBe('Bearer my-api-key');
    expect(headers['Content-Type']).toBe('application/json');

    vi.unstubAllGlobals();
  });
});
