import { ActionIcon, ActionIconProps, Tag } from '@lobehub/ui';
import { Slider } from 'antd';
import { Download, Pause, Play, StopCircle } from 'lucide-react';
import React, { memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { secondsToMinutesAndSeconds } from '@/utils/secondsToMinutesAndSeconds';

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
  buttonSize?: ActionIconProps['size'];
  className?: string;
  showDownload?: boolean;
  showSlider?: boolean;
  showTime?: boolean;
  style?: React.CSSProperties;
  timeRender?: 'tag' | 'text';
  timeStyle?: React.CSSProperties;
  timeType?: 'left' | 'current' | 'combine';
}

const AudioPlayer = memo<AudioPlayerProps>(
  ({
    style,
    timeStyle,
    buttonSize,
    className,
    audio,
    allowPause,
    timeType = 'left',
    showTime = true,
    showSlider = true,
    timeRender = 'text',
    showDownload = true,
  }) => {
    const { isPlaying, play, stop, pause, duration, setTime, currentTime, download } = audio;

    const formatedLeftTime = secondsToMinutesAndSeconds(duration - currentTime);
    const formatedCurrentTime = secondsToMinutesAndSeconds(currentTime);
    const formatedDuration = secondsToMinutesAndSeconds(duration);

    const Time = useMemo(
      () => (timeRender === 'tag' ? Tag : (props: any) => <time {...props} />),
      [timeRender],
    );

    return (
      <Flexbox
        align={'center'}
        className={className}
        gap={8}
        horizontal
        style={{ paddingRight: showDownload ? 0 : 8, width: '100%', ...style }}
      >
        {allowPause ? (
          <ActionIcon
            icon={isPlaying ? Pause : Play}
            onClick={isPlaying ? pause : play}
            size={buttonSize}
            style={{ flex: 'none' }}
          />
        ) : (
          <ActionIcon
            icon={isPlaying ? StopCircle : Play}
            onClick={isPlaying ? stop : play}
            size={buttonSize}
            style={{ flex: 'none' }}
          />
        )}
        {showSlider && (
          <Slider
            max={duration}
            min={0}
            onChange={(e) => setTime(e)}
            style={{ flex: 1 }}
            tooltip={{ formatter: secondsToMinutesAndSeconds as any }}
            value={currentTime}
          />
        )}
        {showTime && (
          <Time style={{ flex: 'none', ...timeStyle }}>
            {timeType === 'left' && formatedLeftTime}
            {timeType === 'current' && formatedCurrentTime}
            {timeType === 'combine' && (
              <span>
                {formatedCurrentTime}
                <span style={{ opacity: 0.66 }}>{` / ${formatedDuration}`}</span>
              </span>
            )}
          </Time>
        )}
        {showDownload && (
          <ActionIcon
            icon={Download}
            onClick={download}
            size={buttonSize}
            style={{ flex: 'none' }}
          />
        )}
      </Flexbox>
    );
  },
);

export default AudioPlayer;
