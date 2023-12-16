import { ActionIcon, type ActionIconProps, Tag } from '@lobehub/ui';
import { Slider } from 'antd';
import { Download, PauseCircle, Play, StopCircle } from 'lucide-react';
import { type CSSProperties, memo, useCallback, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { secondsToMinutesAndSeconds } from '@/core/utils/secondsToMinutesAndSeconds';

export interface AudioProps {
  currentTime: number;
  download: () => void;
  duration: number;
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
  showDonload?: boolean;
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
    showDonload = true,
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
    const { isPlaying, play, stop, pause, duration, setTime, currentTime, download } = audio;

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
    }, [play, duration]);

    const handlePause = useCallback(() => {
      pause?.();
      onPause?.();
    }, [pause]);

    const handleStop = useCallback(() => {
      stop?.();
      onStop?.();
    }, [stop]);

    const handleStopLoading = useCallback(() => {
      if (!isLoading) return;
      onLoadingStop?.();
      stop?.();
      onStop?.();
    }, [stop, isLoading]);

    return (
      <Flexbox
        align={'center'}
        className={className}
        gap={8}
        horizontal
        style={{ width: '100%', ...style }}
      >
        <div onClick={handleStopLoading} style={{ flex: 'none' }}>
          <ActionIcon
            active={buttonActive}
            icon={isPlaying ? (allowPause ? PauseCircle : StopCircle) : Play}
            loading={isLoading}
            onClick={isPlaying ? (allowPause ? handlePause : handleStop) : handlePlay}
            size={buttonSize || { blockSize: 32, fontSize: 16 }}
            style={buttonStyle}
            title={title}
          />
        </div>
        {showSlider && (
          <Slider
            disabled={duration === 0 || isLoading}
            max={duration}
            min={0}
            onChange={(e) => setTime(e)}
            step={0.01}
            style={{ flex: 1 }}
            tooltip={{ formatter: secondsToMinutesAndSeconds as any }}
            value={currentTime}
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
        {!isLoading && showDonload && (
          <ActionIcon
            icon={Download}
            onClick={download}
            size={buttonSize || { blockSize: 32, fontSize: 16 }}
            style={buttonStyle}
          />
        )}
      </Flexbox>
    );
  },
);

export default AudioPlayer;
