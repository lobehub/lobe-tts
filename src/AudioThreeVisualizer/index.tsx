import { Icon } from '@lobehub/ui';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Loader2 } from 'lucide-react';
import React, { CSSProperties, RefObject, Suspense, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import ThreeVisualizer from './ThreeVisualizer';

interface AudioThreeVisualizerProps {
  audioRef: RefObject<HTMLAudioElement>;
  className?: string;
  height?: number | string;
  isLoading?: boolean;
  style?: CSSProperties;
  width?: number | string;
}
const AudioThreeVisualizer = memo<AudioThreeVisualizerProps>(
  ({ className, isLoading, audioRef, style, width = '100%', height = '100%' }) => {
    return (
      <Flexbox
        align={'center'}
        className={className}
        justify={'center'}
        style={{ height, width, ...style }}
      >
        {isLoading ? (
          <Icon icon={Loader2} spin />
        ) : (
          <Suspense fallback={<Icon icon={Loader2} spin />}>
            <Canvas>
              <ThreeVisualizer audioRef={audioRef} />
              <OrbitControls
                autoRotate
                enablePan={false}
                enableZoom={false}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2}
              />
            </Canvas>
          </Suspense>
        )}
      </Flexbox>
    );
  },
);

export default AudioThreeVisualizer;
