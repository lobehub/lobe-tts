import { ActionIcon, type ActionIconProps, Flexbox, Slider, Tag } from '@lobehub/ui';
import { Download, PauseCircle, Play, StopCircle } from 'lucide-react';
import { type CSSProperties, memo, useCallback, useMemo } from 'react';

import { secondsToMinutesAndSeconds } from '@/core/utils/secondsToMinutesAndSeconds';

export interface AudioProps {
  currentTime: number;
  download: () => void;
  duration: number;
  /**
   * Load or playback error; the controls are disabled while it is set.
   */
  error?: Error;
  isPlaying: boolean;
  pause: () => void;
  play: () => void;
  setTime: (time: number) => void;
  stop: () => void;
}

export interface AudioPlayerProps {
  allowPause?: boolean;
  audio: AudioProps;
  autoplay?: boolean;
  buttonActive?: boolean;
  buttonSize?: ActionIconProps['size'];
  buttonStyle?: CSSProperties;
  className?: string;
  isLoading?: boolean;
  onInitPlay?: () => void;
  onLoadingStop?: () => void;
  onPause?: () => void;
  onPlay?: () => void;
  onStop?: () => void;
  /**
   * @deprecated Use `showDownload` instead.
   */
  showDonload?: boolean;
  /**
   * @default true
   */
  showDownload?: boolean;
  showSlider?: boolean;
  showTime?: boolean;
  style?: CSSProperties;
  timeRender?: 'tag' | 'text';
  timeStyle?: CSSProperties;
  timeType?: 'left' | 'current' | 'combine';
  title?: string;
}

const AudioPlayer = memo<AudioPlayerProps>(
  ({
    isLoading,
    style,
    timeStyle,
    buttonSize,
    className,
    onLoadingStop,
    audio = {
      canPlay: false,
      currentTime: 0,
      download: () => {},
      duration: 0,
      isPlaying: false,
      pause: () => {},
      play: () => {},
      setTime: () => {},
      stop: () => {},
    },
    allowPause = true,
    showDonload,
    showDownload = showDonload ?? true,
    buttonActive,
    timeType = 'left',
    showSlider = true,
    showTime = true,
    timeRender = 'text',
    onInitPlay,
    onPause,
    onStop,
    title,
    buttonStyle,
    onPlay,
  }) => {
    const { isPlaying, play, stop, pause, duration, setTime, currentTime, download, error } = audio;
    const hasError = !!error;

    const formattedLeftTime = secondsToMinutesAndSeconds(duration - currentTime);
    const formattedCurrentTime = secondsToMinutesAndSeconds(currentTime);
    const formattedDuration = secondsToMinutesAndSeconds(duration);

    const Time = useMemo(
      () => (timeRender === 'tag' ? Tag : (props: any) => <div {...props} />),
      [timeRender],
    );

    const handlePlay = useCallback(() => {
      if ((!duration || duration === 0) && !isLoading) {
        onInitPlay?.();
      } else {
        play?.();
        onPlay?.();
      }
    }, [play, duration, isLoading, onInitPlay, onPlay]);

    const handlePause = useCallback(() => {
      pause?.();
      onPause?.();
    }, [pause, onPause]);

    const handleStop = useCallback(() => {
      stop?.();
      onStop?.();
    }, [stop, onStop]);

    const handleStopLoading = useCallback(() => {
      if (!isLoading) return;
      onLoadingStop?.();
      stop?.();
      onStop?.();
    }, [stop, isLoading, onLoadingStop, onStop]);

    return (
      <Flexbox
        horizontal
        align={'center'}
        className={className}
        gap={8}
        style={{ width: '100%', ...style }}
      >
        <div style={{ flex: 'none' }} onClick={handleStopLoading}>
          <ActionIcon
            active={buttonActive}
            disabled={hasError}
            icon={isPlaying ? (allowPause ? PauseCircle : StopCircle) : Play}
            loading={isLoading}
            size={buttonSize || { blockSize: 32, size: 16 }}
            style={buttonStyle}
            title={title}
            onClick={isPlaying ? (allowPause ? handlePause : handleStop) : handlePlay}
          />
        </div>
        {showSlider && (
          <Slider
            disabled={duration === 0 || isLoading || hasError}
            max={duration}
            min={0}
            step={0.01}
            style={{ flex: 1 }}
            value={currentTime}
            onChange={setTime}
          />
        )}
        {showTime && (
          <Time style={{ cursor: 'pointer', flex: 'none', margin: 0, ...timeStyle }}>
            {timeType === 'left' && formattedLeftTime}
            {timeType === 'current' && formattedCurrentTime}
            {timeType === 'combine' && (
              <span>
                {formattedCurrentTime}
                <span style={{ opacity: 0.66 }}>{` / ${formattedDuration}`}</span>
              </span>
            )}
          </Time>
        )}
        {!isLoading && showDownload && (
          <ActionIcon
            icon={Download}
            size={buttonSize || { blockSize: 32, size: 16 }}
            style={buttonStyle}
            onClick={download}
          />
        )}
      </Flexbox>
    );
  },
);

export default AudioPlayer;
