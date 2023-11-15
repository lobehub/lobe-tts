import { useTheme } from 'antd-style';
import { RefObject, memo } from 'react';

import { useAudioVisualizer } from '../hooks/useAudioVisualizer';

export interface VisualizerProps {
  borderRadius?: number;
  color?: string;
  count?: number;
  gap?: number;
  maxHeight?: number;
  minHeight?: number;
  width?: number;
}

const Visualizer = memo<VisualizerProps & { audioRef: RefObject<HTMLAudioElement> }>(
  ({ audioRef, count = 4, width = 48, color, ...barStyle }) => {
    const maxHeight = barStyle?.maxHeight || width * 3;
    const minHeight = barStyle?.minHeight || width;
    const borderRadius = barStyle?.borderRadius || width / 2;
    const theme = useTheme();
    const bars = useAudioVisualizer(audioRef, { count });

    return bars.map((bar, index) => (
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
    ));
  },
);

export default Visualizer;
