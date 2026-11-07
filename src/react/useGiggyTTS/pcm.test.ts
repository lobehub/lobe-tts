import { afterEach, describe, expect, it, vi } from 'vitest';

import { consumePcmFramesWithBackpressure, readPcmFrames } from './pcm';

const collect = async (stream: ReadableStream<Uint8Array>) => {
  const frames: Uint8Array[] = [];
  for await (const frame of readPcmFrames(stream)) frames.push(frame);
  return frames;
};

describe('readPcmFrames', () => {
  it('buffers short transport chunks into playable 20 ms frames', async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array(500));
        controller.enqueue(new Uint8Array(500));
        controller.enqueue(new Uint8Array(920));
        controller.close();
      },
    });

    const frames = await collect(stream);
    expect(frames.map(({ byteLength }) => byteLength)).toEqual([960, 960]);
  });

  it('emits a final shorter frame when the stream ends on a complete sample', async () => {
    const frames = await collect(
      new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(new Uint8Array(962));
          controller.close();
        },
      }),
    );

    expect(frames.map(({ byteLength }) => byteLength)).toEqual([960, 2]);
  });

  it('fails when the response ends with an incomplete PCM16 sample', async () => {
    await expect(
      collect(
        new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(new Uint8Array(961));
            controller.close();
          },
        }),
      ),
    ).rejects.toThrow('incomplete PCM16 sample');
  });
});

describe('bounded PCM playback', () => {
  afterEach(() => vi.useRealTimers());

  it('backpressures a fast response and Stop wakes the reader wait', async () => {
    vi.useFakeTimers();
    let now = 0;
    let scheduledUntil = 0;
    let scheduledFrames = 0;
    let pulls = 0;
    let cancelled = false;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulls += 1;
        controller.enqueue(new Uint8Array(960)); // one 20 ms PCM16 frame
      },
      cancel() {
        cancelled = true;
      },
    });
    const stop = new AbortController();
    let finished = false;
    const playback = consumePcmFramesWithBackpressure(
      stream,
      () => now,
      () => scheduledUntil,
      (frame) => {
        scheduledFrames += 1;
        scheduledUntil += frame.byteLength / (2 * 24_000);
      },
      stop.signal,
      0.1,
    ).finally(() => {
      finished = true;
    });

    await vi.advanceTimersByTimeAsync(40);
    expect(scheduledFrames).toBeLessThanOrEqual(6);
    expect(finished).toBe(false);

    // Simulate the playhead advancing, then stop again while a later read is
    // blocked by the same bounded horizon.
    now = 0.08;
    await vi.advanceTimersByTimeAsync(40);
    expect(scheduledFrames).toBeLessThanOrEqual(11);
    expect(finished).toBe(false);
    stop.abort();
    await playback;

    expect(finished).toBe(true);
    expect(cancelled).toBe(true);
    expect(pulls).toBeLessThan(20);
  });
});
