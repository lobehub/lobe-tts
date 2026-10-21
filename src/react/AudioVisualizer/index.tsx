import { ErrorBoundary, Flexbox, Icon } from '@lobehub/ui';
import { Loader2 } from 'lucide-react';
import type { CSSProperties, RefObject } from 'react';
import { memo } from 'react';

import type { VisualizerProps } from './Visualizer';
import Visualizer from './Visualizer';

export interface AudioVisualizerProps {
  audioRef: RefObject<HTMLAudioElement>;
  barStyle?: VisualizerProps;
  className?: string;
  color?: string;
  isLoading?: boolean;
  style?: CSSProperties;
}

const AudioVisualizer = memo<AudioVisualizerProps>(
  ({ audioRef, isLoading, barStyle, style, className }) => {
    const { count, width, gap } = { count: 4, gap: 4, width: 48, ...barStyle };
    const maxHeight = barStyle?.maxHeight || width * 3;
    const containerStyle: CSSProperties = {
      fontSize: 24,
      height: maxHeight,
      minWidth: (width + gap) * count,
      ...style,
    };
    return (
      <ErrorBoundary fallback={<div className={className} style={containerStyle} />}>
        <Flexbox
          horizontal
          align={'center'}
          className={className}
          gap={gap}
          justify={'center'}
          style={containerStyle}
        >
          {isLoading ? (
            <Icon spin icon={Loader2} />
          ) : (
            <Visualizer audioRef={audioRef} {...barStyle} />
          )}
        </Flexbox>
      </ErrorBoundary>
    );
  },
);

export default AudioVisualizer;
