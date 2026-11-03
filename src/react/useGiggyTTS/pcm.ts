const SAMPLE_BYTES = 2;
const DEFAULT_FRAME_BYTES = 960; // 20 ms of mono PCM16 at 24 kHz.

export const readPcmFrames = async function* (
  stream: ReadableStream<Uint8Array>,
  signal?: AbortSignal,
): AsyncGenerator<Uint8Array> {
  const reader = stream.getReader();
  const onAbort = () => void reader.cancel(signal?.reason);
  signal?.addEventListener('abort', onAbort, { once: true });
  let carry = new Uint8Array(0);

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (signal?.aborted) return;
      if (done) break;

      const merged = new Uint8Array(carry.length + value.length);
      merged.set(carry);
      merged.set(value, carry.length);
      let offset = 0;
      while (merged.length - offset >= DEFAULT_FRAME_BYTES) {
        yield merged.slice(offset, offset + DEFAULT_FRAME_BYTES);
        offset += DEFAULT_FRAME_BYTES;
      }
      carry = merged.slice(offset);
    }

    if (carry.length % SAMPLE_BYTES !== 0) {
      throw new Error('Giggy Streaming response ended with an incomplete PCM16 sample.');
    }
    if (carry.length > 0) yield carry;
  } finally {
    signal?.removeEventListener('abort', onAbort);
    reader.releaseLock();
  }
};
