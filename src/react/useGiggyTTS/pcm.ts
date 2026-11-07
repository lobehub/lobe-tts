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

/**
 * Keep only a short horizon of decoded PCM scheduled ahead of playback.
 * Waiting here applies backpressure to the response reader; abort wakes the
 * wait immediately and readPcmFrames cancels its underlying response reader.
 */
export const consumePcmFramesWithBackpressure = async (
  stream: ReadableStream<Uint8Array>,
  currentTime: () => number,
  scheduledUntil: () => number,
  scheduleFrame: (frame: Uint8Array) => void,
  signal: AbortSignal,
  maxAheadSeconds = 0.5,
): Promise<boolean> => {
  if (!Number.isFinite(maxAheadSeconds) || maxAheadSeconds < 0) {
    throw new Error('PCM playback horizon must be a finite non-negative number.');
  }

  for await (const frame of readPcmFrames(stream, signal)) {
    while (scheduledUntil() - currentTime() > maxAheadSeconds) {
      if (signal.aborted) return false;

      await new Promise<void>((resolve) => {
        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          signal.removeEventListener('abort', finish);
          resolve();
        };
        const timer = setTimeout(finish, 20);
        signal.addEventListener('abort', finish, { once: true });
        if (signal.aborted) finish();
      });
    }

    if (signal.aborted) return false;
    scheduleFrame(frame);
  }

  return !signal.aborted;
};
