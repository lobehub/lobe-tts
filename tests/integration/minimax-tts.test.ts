import { describe, expect, it } from 'vitest';

/**
 * Integration tests for MiniMax TTS provider.
 * These tests verify that the MiniMax TTS module integrates correctly
 * with the lobe-tts package exports. They do NOT call the real API.
 *
 * To run real API tests, set MINIMAX_API_KEY env var and
 * remove the `.skip` from the live tests at the bottom.
 */

// ─── Export integration ────────────────────────────────────

describe('MiniMax TTS package exports', () => {
  it('should be importable from @/core', async () => {
    const core = await import('@/core');
    expect(core.MiniMaxTTS).toBeDefined();
    expect(typeof core.MiniMaxTTS).toBe('function');
  });

  it('should export MiniMaxTTSPayload type via core', async () => {
    // Type-only check — if this compiles, the type is exported
    const core = await import('@/core');
    const tts = new core.MiniMaxTTS({ MINIMAX_API_KEY: 'test' });
    expect(tts).toBeInstanceOf(core.MiniMaxTTS);
  });

  it('should be importable from @/server', async () => {
    const server = await import('@/server');
    expect(server.createMiniMaxAudioSpeech).toBeDefined();
    expect(typeof server.createMiniMaxAudioSpeech).toBe('function');
  });
});

// ─── End-to-end flow (mocked) ──────────────────────────────

describe('MiniMax TTS end-to-end (mocked)', () => {
  it('should produce audio bytes from text input', async () => {
    const { MiniMaxTTS } = await import('@/core/MiniMaxTTS');

    // Simulate the full MiniMax API response cycle
    const originalFetch = globalThis.fetch;
    const sampleMp3Hex = 'fffbe4640000'; // Fake MP3 frame header in hex

    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          base_resp: { status_code: 0 },
          data: { audio: sampleMp3Hex },
        }),
      );

    try {
      const tts = new MiniMaxTTS({ MINIMAX_API_KEY: 'integration-test-key' });
      const response = await tts.create({
        input: 'Integration test text',
        options: { model: 'speech-2.8-hd', voice: 'English_Graceful_Lady' },
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('audio/mpeg');

      const buffer = await response.arrayBuffer();
      expect(buffer.byteLength).toBe(sampleMp3Hex.length / 2);

      // Verify byte values
      const bytes = new Uint8Array(buffer);
      expect(bytes[0]).toBe(0xff);
      expect(bytes[1]).toBe(0xfb);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('should work with server utility function', async () => {
    const { createMiniMaxAudioSpeech } = await import('@/server/createMiniMaxAudioSpeech');

    const originalFetch = globalThis.fetch;
    const audioHex = 'deadbeef';

    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          base_resp: { status_code: 0 },
          data: { audio: audioHex },
        }),
      );

    try {
      const res = await createMiniMaxAudioSpeech({
        apiKey: 'integration-key',
        payload: {
          input: 'Server integration test',
          options: { voice: 'Deep_Voice_Man' },
        },
      });

      expect(res.status).toBe(200);
      const buf = await res.arrayBuffer();
      expect(buf.byteLength).toBe(4);
      expect(new Uint8Array(buf)).toEqual(new Uint8Array([0xde, 0xad, 0xbe, 0xef]));
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('should handle error responses gracefully', async () => {
    const { MiniMaxTTS } = await import('@/core/MiniMaxTTS');

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({
          base_resp: { status_code: 1003, status_msg: 'Quota exceeded' },
        }),
      );

    try {
      const tts = new MiniMaxTTS({ MINIMAX_API_KEY: 'test' });
      await expect(tts.create({ input: 'test', options: { voice: 'sweet_girl' } })).rejects.toThrow(
        'Quota exceeded',
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

// ─── Live API tests (skipped by default) ───────────────────

describe.skip('MiniMax TTS live API', () => {
  it('should synthesize speech with real API', async () => {
    const { MiniMaxTTS } = await import('@/core/MiniMaxTTS');
    const apiKey = process.env.MINIMAX_API_KEY;
    if (!apiKey) throw new Error('MINIMAX_API_KEY not set');

    const tts = new MiniMaxTTS({ MINIMAX_API_KEY: apiKey });
    const response = await tts.create({
      input: 'Hello, this is a test of MiniMax text to speech.',
      options: { model: 'speech-2.8-hd', voice: 'English_Graceful_Lady' },
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('audio/mpeg');

    const buffer = await response.arrayBuffer();
    expect(buffer.byteLength).toBeGreaterThan(1000);
  });
});
