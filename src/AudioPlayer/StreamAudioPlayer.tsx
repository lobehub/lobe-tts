import { ActionIcon, ActionIconProps, Tag } from '@lobehub/ui';
import { Slider } from 'antd';
import { Pause, Play, StopCircle } from 'lucide-react';
import React, { memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { AudioProps } from '@/hooks/useStreamAudioPlayer';
import { secondsToMinutesAndSeconds } from '@/utils/secondsToMinutesAndSeconds';

export interface StreamAudioPlayerProps {
  allowPause?: boolean;
  audio: AudioProps;
  buttonSize?: ActionIconProps['size'];
  className?: string;
  showSlider?: boolean;
  showTime?: boolean;
  style?: React.CSSProperties;
  timeRender?: 'tag' | 'text';
  timeStyle?: React.CSSProperties;
  timeType?: 'left' | 'current' | 'combine';
}

const StreamAudioPlayer = memo<StreamAudioPlayerProps>(
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
  }) => {
    const { isPlaying, play, stop, pause, duration, setTime, currentTime } = audio;

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
        style={{ paddingRight: 8, width: '100%', ...style }}
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
      </Flexbox>
    );
  },
);

export default StreamAudioPlayer;
