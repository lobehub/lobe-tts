import { describe, expect, it } from 'vitest';

import { readPcmFrames } from './pcm';

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
