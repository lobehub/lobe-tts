import { CambAITTS, type CambAITTSPayload } from '@/core/CambAITTS';
import voiceList, { getCambAIVoiceOptions } from '@/core/CambAITTS/voiceList';
import { CAMBAI_BASE_URL } from '@/core/const/api';
import { createCambAIAudioSpeech } from '@/server/createCambAIAudioSpeech';

const fetchMock = vi.fn();
global.fetch = fetchMock;

const mockResponse = (body = 'audio-data', status = 200) =>
  new Response(body, { status, headers: { 'Content-Type': 'audio/mpeg' } });

const defaultPayload: CambAITTSPayload = {
  input: 'Hello world',
  options: {
    language: 'en-us',
    voice_id: 147_320,
  },
};

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockResolvedValue(mockResponse());
});

// ─── Constructor ─────────────────────────────────────────────────────

describe('CambAITTS constructor', () => {
  it('uses default CAMBAI_BASE_URL when no proxy is provided', async () => {
    const tts = new CambAITTS();
    await tts.fetch(defaultPayload);

    const url = fetchMock.mock.calls[0][0];
    expect(url).toContain(CAMBAI_BASE_URL);
  });

  it('uses custom CAMBAI_PROXY_URL when provided', async () => {
    const tts = new CambAITTS({ CAMBAI_PROXY_URL: 'https://proxy.example.com' });
    await tts.fetch(defaultPayload);

    const url = fetchMock.mock.calls[0][0];
    expect(url).toContain('https://proxy.example.com');
  });

  it('passes API key in x-api-key header', async () => {
    const tts = new CambAITTS({ CAMBAI_API_KEY: 'test-key-123' });
    await tts.fetch(defaultPayload);

    const headers: Headers = fetchMock.mock.calls[0][1].headers;
    expect(headers.get('x-api-key')).toBe('test-key-123');
  });

  it('sends empty x-api-key when no key provided', async () => {
    const tts = new CambAITTS();
    await tts.fetch(defaultPayload);

    const headers: Headers = fetchMock.mock.calls[0][1].headers;
    expect(headers.get('x-api-key')).toBe('');
  });
});

// ─── Voice list and options ──────────────────────────────────────────

describe('Voice list and options', () => {
  it('has 12 voices in CambAITTS.voiceList', () => {
    expect(CambAITTS.voiceList).toHaveLength(12);
  });

  it('each voice has id (number), language (string), and name (string)', () => {
    for (const voice of voiceList) {
      expect(typeof voice.id).toBe('number');
      expect(typeof voice.language).toBe('string');
      expect(typeof voice.name).toBe('string');
    }
  });

  it('includes known voices Attic=147320 and Pearl=147331', () => {
    const attic = voiceList.find((v) => v.name === 'Attic');
    const pearl = voiceList.find((v) => v.name === 'Pearl');

    expect(attic).toBeDefined();
    expect(attic!.id).toBe(147_320);
    expect(pearl).toBeDefined();
    expect(pearl!.id).toBe(147_331);
  });

  it('voiceOptions returns { label, value } arrays', () => {
    const tts = new CambAITTS();
    const options = tts.voiceOptions;

    expect(options).toHaveLength(12);
    for (const opt of options!) {
      expect(opt).toHaveProperty('label');
      expect(opt).toHaveProperty('value');
    }
  });

  it('first option maps to { label: "Attic", value: 147320 }', () => {
    const options = getCambAIVoiceOptions();

    expect(options![0]).toEqual({ label: 'Attic', value: 147_320 });
  });
});

// ─── fetch() – direct API call ───────────────────────────────────────

describe('fetch() - direct API call', () => {
  let tts: CambAITTS;

  beforeEach(() => {
    tts = new CambAITTS({ CAMBAI_API_KEY: 'key-abc' });
  });

  it('POSTs to correct URL', async () => {
    await tts.fetch(defaultPayload);

    expect(fetchMock).toHaveBeenCalledWith(
      `${CAMBAI_BASE_URL}/tts-stream`,
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('sends correct headers', async () => {
    await tts.fetch(defaultPayload);

    const headers: Headers = fetchMock.mock.calls[0][1].headers;
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('x-api-key')).toBe('key-abc');
  });

  it('sends correct body', async () => {
    await tts.fetch(defaultPayload);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toEqual({
      language: 'en-us',
      output_configuration: { format: 'mp3' },
      speech_model: 'mars-flash',
      text: 'Hello world',
      voice_id: 147_320,
    });
  });

  it('defaults speech_model to mars-flash', async () => {
    await tts.fetch(defaultPayload);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.speech_model).toBe('mars-flash');
  });

  it('defaults language to en-us on falsy value', async () => {
    const payload: CambAITTSPayload = {
      input: 'test',
      options: { language: '', voice_id: 147_320 },
    };
    await tts.fetch(payload);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.language).toBe('en-us');
  });

  it('uses custom speech_model when provided', async () => {
    const payload: CambAITTSPayload = {
      input: 'test',
      options: { language: 'en-us', speech_model: 'mars-pro', voice_id: 147_320 },
    };
    await tts.fetch(payload);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.speech_model).toBe('mars-pro');
  });

  it('defaults format to mp3', async () => {
    await tts.fetch(defaultPayload);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.output_configuration.format).toBe('mp3');
  });

  it('uses custom format when provided', async () => {
    const payload: CambAITTSPayload = {
      input: 'test',
      options: { format: 'wav', language: 'en-us', voice_id: 147_320 },
    };
    await tts.fetch(payload);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.output_configuration.format).toBe('wav');
  });

  it('returns a Response', async () => {
    const result = await tts.fetch(defaultPayload);
    expect(result).toBeInstanceOf(Response);
  });
});

// ─── fetch() – serviceUrl routing ────────────────────────────────────

describe('fetch() - serviceUrl routing', () => {
  it('POSTs to serviceUrl instead of base URL', async () => {
    const tts = new CambAITTS({ serviceUrl: 'https://my-service.com/tts' });
    await tts.fetch(defaultPayload);

    expect(fetchMock.mock.calls[0][0]).toBe('https://my-service.com/tts');
  });

  it('sends raw payload (not transformed) as body', async () => {
    const tts = new CambAITTS({ serviceUrl: 'https://my-service.com/tts' });
    await tts.fetch(defaultPayload);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toEqual(defaultPayload);
  });

  it('uses custom headers', async () => {
    const customHeaders = new Headers({ Authorization: 'Bearer token' });
    const tts = new CambAITTS({
      headers: customHeaders,
      serviceUrl: 'https://my-service.com/tts',
    });
    await tts.fetch(defaultPayload);

    const headers: Headers = fetchMock.mock.calls[0][1].headers;
    expect(headers.get('Authorization')).toBe('Bearer token');
  });

  it('does not include x-api-key', async () => {
    const tts = new CambAITTS({
      CAMBAI_API_KEY: 'should-not-appear',
      serviceUrl: 'https://my-service.com/tts',
    });
    await tts.fetch(defaultPayload);

    const headers = fetchMock.mock.calls[0][1].headers;
    // serviceUrl path passes this.headers (undefined), not a new Headers with api key
    expect(headers).toBeUndefined();
  });
});

// ─── create() ────────────────────────────────────────────────────────

describe('create()', () => {
  it('returns the Response from fetch', async () => {
    const tts = new CambAITTS({ CAMBAI_API_KEY: 'key' });
    const response = await tts.create(defaultPayload);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
  });

  it('propagates fetch errors', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network failure'));
    const tts = new CambAITTS({ CAMBAI_API_KEY: 'key' });

    await expect(tts.create(defaultPayload)).rejects.toThrow('Network failure');
  });
});

// ─── createCambAIAudioSpeech server helper ───────────────────────────

describe('createCambAIAudioSpeech server helper', () => {
  it('POSTs to default baseUrl + /tts-stream', async () => {
    await createCambAIAudioSpeech({ apiKey: 'srv-key', payload: defaultPayload });

    expect(fetchMock.mock.calls[0][0]).toBe('https://client.camb.ai/apis/tts-stream');
  });

  it('POSTs to custom baseUrl + /tts-stream', async () => {
    await createCambAIAudioSpeech({
      apiKey: 'srv-key',
      baseUrl: 'https://custom.api.com',
      payload: defaultPayload,
    });

    expect(fetchMock.mock.calls[0][0]).toBe('https://custom.api.com/tts-stream');
  });

  it('sends correct headers as plain object with x-api-key', async () => {
    await createCambAIAudioSpeech({ apiKey: 'srv-key', payload: defaultPayload });

    const headers = fetchMock.mock.calls[0][1].headers;
    expect(headers).toEqual({
      'Content-Type': 'application/json',
      'x-api-key': 'srv-key',
    });
  });

  it('sends correct body structure', async () => {
    await createCambAIAudioSpeech({ apiKey: 'srv-key', payload: defaultPayload });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toEqual({
      language: 'en-us',
      output_configuration: { format: 'mp3' },
      speech_model: 'mars-flash',
      text: 'Hello world',
      voice_id: 147_320,
    });
  });

  it('applies defaults for language and speech_model', async () => {
    const payload: CambAITTSPayload = {
      input: 'test',
      options: { language: '', voice_id: 147_320 },
    };
    await createCambAIAudioSpeech({ apiKey: 'srv-key', payload });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.language).toBe('en-us');
    expect(body.speech_model).toBe('mars-flash');
  });

  it('uses custom format when provided', async () => {
    const payload: CambAITTSPayload = {
      input: 'test',
      options: { format: 'wav', language: 'en-us', voice_id: 147_320 },
    };
    await createCambAIAudioSpeech({ apiKey: 'srv-key', payload });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.output_configuration.format).toBe('wav');
  });
});

// ─── createAudio (skipped – requires AudioContext) ───────────────────

describe.todo('createAudio() - requires AudioContext.decodeAudioData (not in jsdom)');
