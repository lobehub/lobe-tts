import { describe, expect, it, vi } from 'vitest';

import { MiniMaxTTS } from '@/core/MiniMaxTTS';
import voiceList, { getMiniMaxVoiceOptions } from '@/core/MiniMaxTTS/voiceList';

// ─── voiceList ─────────────────────────────────────────────

describe('MiniMax voiceList', () => {
  it('should contain 12 voices', () => {
    expect(voiceList).toHaveLength(12);
  });

  it('should include known voice IDs', () => {
    expect(voiceList).toContain('English_Graceful_Lady');
    expect(voiceList).toContain('Deep_Voice_Man');
    expect(voiceList).toContain('sweet_girl');
  });
});

describe('getMiniMaxVoiceOptions', () => {
  it('should return Antd SelectProps options', () => {
    const options = getMiniMaxVoiceOptions();
    expect(options).toHaveLength(12);
    expect(options![0]).toEqual({
      label: 'English Graceful Lady',
      value: 'English_Graceful_Lady',
    });
  });

  it('should replace underscores with spaces in labels', () => {
    const options = getMiniMaxVoiceOptions();
    for (const opt of options!) {
      expect((opt as { label: string }).label).not.toContain('_');
    }
  });
});

// ─── MiniMaxTTS class ──────────────────────────────────────

describe('MiniMaxTTS', () => {
  it('should instantiate with defaults', () => {
    const tts = new MiniMaxTTS();
    expect(tts).toBeInstanceOf(MiniMaxTTS);
  });

  it('should instantiate with custom API key and proxy', () => {
    const tts = new MiniMaxTTS({
      MINIMAX_API_KEY: 'test-key',
      MINIMAX_PROXY_URL: 'https://custom.proxy/v1',
    });
    expect(tts).toBeInstanceOf(MiniMaxTTS);
  });

  it('should expose voiceOptions getter', () => {
    const tts = new MiniMaxTTS();
    const options = tts.voiceOptions;
    expect(options).toHaveLength(12);
    expect(options![0].value).toBe('English_Graceful_Lady');
  });

  it('should expose static voiceList', () => {
    expect(MiniMaxTTS.voiceList).toHaveLength(12);
    expect(MiniMaxTTS.voiceList).toContain('cute_boy');
  });

  describe('fetch', () => {
    it('should call MiniMax API with correct payload', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            base_resp: { status_code: 0 },
            data: { audio: '48656c6c6f' },
          }),
        ),
      );
      vi.stubGlobal('fetch', mockFetch);

      const tts = new MiniMaxTTS({ MINIMAX_API_KEY: 'test-key' });
      await tts.fetch({
        input: 'Hello',
        options: { voice: 'English_Graceful_Lady' },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.minimax.io/v1/t2a_v2',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            audio_setting: { format: 'mp3' },
            model: 'speech-2.8-hd',
            text: 'Hello',
            voice_setting: { voice_id: 'English_Graceful_Lady' },
          }),
        }),
      );

      vi.unstubAllGlobals();
    });

    it('should use custom model when specified', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            base_resp: { status_code: 0 },
            data: { audio: 'aabb' },
          }),
        ),
      );
      vi.stubGlobal('fetch', mockFetch);

      const tts = new MiniMaxTTS({ MINIMAX_API_KEY: 'test-key' });
      await tts.fetch({
        input: 'Test',
        options: { model: 'speech-2.8-turbo', voice: 'cute_boy' },
      });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.model).toBe('speech-2.8-turbo');

      vi.unstubAllGlobals();
    });

    it('should use serviceUrl when provided', async () => {
      const mockFetch = vi.fn().mockResolvedValue(new Response('audio-bytes'));
      vi.stubGlobal('fetch', mockFetch);

      const tts = new MiniMaxTTS({ serviceUrl: '/api/minimax-tts' });
      await tts.fetch({
        input: 'Hi',
        options: { voice: 'Wise_Woman' },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/minimax-tts',
        expect.objectContaining({ method: 'POST' }),
      );

      vi.unstubAllGlobals();
    });

    it('should use proxy URL when provided', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            base_resp: { status_code: 0 },
            data: { audio: 'aabb' },
          }),
        ),
      );
      vi.stubGlobal('fetch', mockFetch);

      const tts = new MiniMaxTTS({
        MINIMAX_API_KEY: 'test-key',
        MINIMAX_PROXY_URL: 'https://proxy.example.com/v1',
      });
      await tts.fetch({
        input: 'Test',
        options: { voice: 'Deep_Voice_Man' },
      });

      expect(mockFetch.mock.calls[0][0]).toBe('https://proxy.example.com/v1/t2a_v2');

      vi.unstubAllGlobals();
    });

    it('should include Authorization header', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            base_resp: { status_code: 0 },
            data: { audio: 'aabb' },
          }),
        ),
      );
      vi.stubGlobal('fetch', mockFetch);

      const tts = new MiniMaxTTS({ MINIMAX_API_KEY: 'my-secret-key' });
      await tts.fetch({
        input: 'Hi',
        options: { voice: 'lovely_girl' },
      });

      const headers = mockFetch.mock.calls[0][1].headers;
      expect(headers.get('Authorization')).toBe('Bearer my-secret-key');
      expect(headers.get('Content-Type')).toBe('application/json');

      vi.unstubAllGlobals();
    });
  });

  describe('create', () => {
    it('should return a Response with audio/mpeg content', async () => {
      // "Hello" in hex
      const hexAudio = '48656c6c6f';
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            base_resp: { status_code: 0 },
            data: { audio: hexAudio },
          }),
        ),
      );
      vi.stubGlobal('fetch', mockFetch);

      const tts = new MiniMaxTTS({ MINIMAX_API_KEY: 'test-key' });
      const response = await tts.create({
        input: 'Hello',
        options: { voice: 'English_Graceful_Lady' },
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('audio/mpeg');

      const buffer = await response.arrayBuffer();
      const text = new TextDecoder().decode(buffer);
      expect(text).toBe('Hello');

      vi.unstubAllGlobals();
    });

    it('should throw on API error', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            base_resp: { status_code: 1001, status_msg: 'Invalid API key' },
          }),
        ),
      );
      vi.stubGlobal('fetch', mockFetch);

      const tts = new MiniMaxTTS({ MINIMAX_API_KEY: 'bad-key' });
      await expect(tts.create({ input: 'Test', options: { voice: 'cute_boy' } })).rejects.toThrow(
        'MiniMax TTS error: Invalid API key',
      );

      vi.unstubAllGlobals();
    });

    it('should throw when no audio data is returned', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            base_resp: { status_code: 0 },
            data: {},
          }),
        ),
      );
      vi.stubGlobal('fetch', mockFetch);

      const tts = new MiniMaxTTS({ MINIMAX_API_KEY: 'test-key' });
      await expect(tts.create({ input: 'Test', options: { voice: 'sweet_girl' } })).rejects.toThrow(
        'MiniMax TTS error: No audio data returned',
      );

      vi.unstubAllGlobals();
    });

    it('should pass through Response directly when using serviceUrl', async () => {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response('raw-audio-bytes', {
          headers: { 'Content-Type': 'audio/mpeg' },
          status: 200,
        }),
      );
      vi.stubGlobal('fetch', mockFetch);

      const tts = new MiniMaxTTS({ serviceUrl: '/api/minimax-tts' });
      const response = await tts.create({
        input: 'Hi',
        options: { voice: 'Friendly_Person' },
      });

      expect(response.status).toBe(200);
      const body = await response.text();
      expect(body).toBe('raw-audio-bytes');

      vi.unstubAllGlobals();
    });
  });

  describe('hex conversion', () => {
    it('should correctly convert hex audio to binary', async () => {
      // 0xff 0x00 0xab in hex
      const hexAudio = 'ff00ab';
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            base_resp: { status_code: 0 },
            data: { audio: hexAudio },
          }),
        ),
      );
      vi.stubGlobal('fetch', mockFetch);

      const tts = new MiniMaxTTS({ MINIMAX_API_KEY: 'test-key' });
      const response = await tts.create({
        input: 'Test',
        options: { voice: 'English_Persuasive_Man' },
      });

      const buffer = await response.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      expect(bytes).toEqual(new Uint8Array([0xff, 0x00, 0xab]));

      vi.unstubAllGlobals();
    });
  });
});
