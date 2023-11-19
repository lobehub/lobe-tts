import { ActionIcon, type ActionIconProps, Icon, Tag } from '@lobehub/ui';
import { Dropdown, Slider } from 'antd';
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
        style={{ paddingRight: 8, width: '100%', ...style }}
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
          <Dropdown
            disabled={duration === 0}
            menu={{
              items: [
                {
                  key: 'download',
                  label: <Icon icon={Download} size={{ fontSize: 16 }} />,
                  onClick: download,
                },
              ],
            }}
            placement="top"
          >
            <Time style={{ cursor: 'pointer', flex: 'none', ...timeStyle }}>
              {timeType === 'left' && formattedLeftTime}
              {timeType === 'current' && formattedCurrentTime}
              {timeType === 'combine' && (
                <span>
                  {formattedCurrentTime}
                  <span style={{ opacity: 0.66 }}>{` / ${formattedDuration}`}</span>
                </span>
              )}
            </Time>
          </Dropdown>
        )}
      </Flexbox>
    );
  },
);

export default AudioPlayer;
