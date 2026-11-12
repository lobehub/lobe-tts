import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useAudioPlayer } from '../useAudioPlayer';

const SRC = 'https://cdn.example.com/voice.mp3';

const setMediaProperty = (audio: HTMLAudioElement, key: string, value: unknown) =>
  Object.defineProperty(audio, key, { configurable: true, value });

describe('useAudioPlayer', () => {
  let loadSpy: ReturnType<typeof vi.spyOn>;
  let playSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    loadSpy = vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
    playSpy = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockImplementation(() => Promise.resolve());
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('streaming', () => {
    it('assigns the source to the element without fetching it', () => {
      const { result } = renderHook(() => useAudioPlayer({ src: SRC, streaming: true }));

      expect(fetch).not.toHaveBeenCalled();
      expect(result.current.ref.current?.src).toBe(SRC);
      expect(loadSpy).toHaveBeenCalled();
      expect(result.current.isLoading).toBe(true);
      expect(result.current.arrayBuffers).toEqual([]);
    });

    it('reports the duration once metadata loads and ignores Infinity', () => {
      const { result } = renderHook(() => useAudioPlayer({ src: SRC, streaming: true }));
      const audio = result.current.ref.current!;

      act(() => {
        setMediaProperty(audio, 'duration', Infinity);
        audio.dispatchEvent(new Event('loadedmetadata'));
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.duration).toBe(0);

      act(() => {
        setMediaProperty(audio, 'duration', 12.5);
        audio.dispatchEvent(new Event('durationchange'));
      });
      expect(result.current.duration).toBe(12.5);
    });

    it('resets the playback state when the source changes', () => {
      const { result, rerender } = renderHook(
        ({ src }) => useAudioPlayer({ src, streaming: true }),
        { initialProps: { src: SRC } },
      );
      const audio = result.current.ref.current!;

      act(() => {
        setMediaProperty(audio, 'currentTime', 4);
        audio.dispatchEvent(new Event('timeupdate'));
      });
      expect(result.current.currentTime).toBe(4);

      const next = 'https://cdn.example.com/next.mp3';
      rerender({ src: next });

      expect(audio.src).toBe(next);
      expect(result.current.currentTime).toBe(0);
    });
  });

  describe('errors', () => {
    it('exposes a media error and stops loading', () => {
      const { result } = renderHook(() => useAudioPlayer({ src: SRC, streaming: true }));
      const audio = result.current.ref.current!;

      act(() => {
        setMediaProperty(audio, 'error', { code: 4, message: 'unsupported source' });
        audio.dispatchEvent(new Event('error'));
      });

      expect(result.current.error?.message).toBe('unsupported source');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isPlaying).toBe(false);
    });

    it('rolls back isPlaying and exposes the error when play() rejects', async () => {
      playSpy.mockImplementation(() => Promise.reject(new Error('NotAllowedError')));
      const { result } = renderHook(() => useAudioPlayer({ src: SRC, streaming: true }));

      act(() => result.current.play());

      await waitFor(() => expect(result.current.isPlaying).toBe(false));
      expect(result.current.error?.message).toBe('NotAllowedError');
    });

    it('does not treat an interrupted play() as an error', async () => {
      const abort = Object.assign(new Error('interrupted'), { name: 'AbortError' });
      playSpy.mockImplementation(() => Promise.reject(abort));
      const { result } = renderHook(() => useAudioPlayer({ src: SRC, streaming: true }));

      act(() => result.current.play());

      await waitFor(() => expect(result.current.isPlaying).toBe(false));
      expect(result.current.error).toBeUndefined();
    });

    it('exposes a failed fetch in the default mode', async () => {
      vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 403 }));
      const { result } = renderHook(() => useAudioPlayer({ src: `${SRC}?fetch-error` }));

      await waitFor(() => expect(result.current.error?.message).toContain('403'));
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('follows the native play and pause events', () => {
    const { result } = renderHook(() => useAudioPlayer({ src: SRC, streaming: true }));
    const audio = result.current.ref.current!;

    act(() => audio.dispatchEvent(new Event('play')));
    expect(result.current.isPlaying).toBe(true);

    act(() => audio.dispatchEvent(new Event('pause')));
    expect(result.current.isPlaying).toBe(false);
  });

  it('downloads with the given file name', () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    let anchor: HTMLAnchorElement | undefined;
    click.mockImplementation(function (this: HTMLAnchorElement) {
      anchor = this;
    });
    const { result } = renderHook(() =>
      useAudioPlayer({ filename: 'voice.mp3', src: SRC, streaming: true }),
    );

    act(() => result.current.download());

    expect(anchor?.download).toBe('voice.mp3');
    expect(anchor?.href).toBe(SRC);
  });
});
