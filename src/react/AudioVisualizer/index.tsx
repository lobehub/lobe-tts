import { Icon } from '@lobehub/ui';
import { Loader2 } from 'lucide-react';
import { CSSProperties, RefObject, memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Flexbox } from 'react-layout-kit';

import Visualizer, { VisualizerProps } from './Visualizer';

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
      <ErrorBoundary fallback={<div className={className} style={containerStyle}></div>}>
        <Flexbox
          align={'center'}
          className={className}
          gap={gap}
          horizontal
          justify={'center'}
          style={containerStyle}
        >
          {isLoading ? (
            <Icon icon={Loader2} spin />
          ) : (
            <Visualizer audioRef={audioRef} {...barStyle} />
          )}
        </Flexbox>
      </ErrorBoundary>
    );
  },
);

export default AudioVisualizer;
