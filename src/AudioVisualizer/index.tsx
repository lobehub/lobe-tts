import { useTheme } from 'antd-style';
import React, { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useAudioVisualizer } from '@/hooks/useAudioVisualizer';

export interface AudioVisualizerProps {
  audio: HTMLAudioElement;
  barStyle?: {
    borderRadius?: number;
    count?: number;
    gap?: number;
    maxHeight?: number;
    minHeight?: number;
    width?: number;
  };
  color?: string;
}

const AudioVisualizer = memo<AudioVisualizerProps>(({ color, audio, barStyle }) => {
  const { count, width, gap } = { count: 4, gap: 4, width: 48, ...barStyle };
  const maxHeight = barStyle?.maxHeight || width * 3;
  const minHeight = barStyle?.minHeight || width;
  const borderRadius = barStyle?.borderRadius || width / 2;
  const theme = useTheme();
  const bars = useAudioVisualizer(audio, { count });
  return (
    <Flexbox align={'center'} gap={gap} horizontal style={{ height: maxHeight }}>
      {bars.map((bar, index) => (
        <div
          key={index}
          style={{
            background: color || theme.colorPrimary,
            borderRadius,
            height: minHeight + (bar / 255) * (maxHeight - minHeight),
            transition: 'height 50ms cubic-bezier(.2,-0.5,.8,1.5)',
            width,
          }}
        />
      ))}
    </Flexbox>
  );
});

export default AudioVisualizer;
