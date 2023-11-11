import { useSpring } from '@react-spring/core';
import { a } from '@react-spring/three';
import { Environment, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useTheme, useThemeMode } from 'antd-style';
import React, { RefObject, Suspense, memo, useRef, useState } from 'react';

import { useAudioThreeVisualizer } from '@/hooks/useAudioThreeVisualizer';

const AnimatedMaterial = a(MeshDistortMaterial);

const ThreeVisualizer = memo<{ audioRef: RefObject<HTMLAudioElement> }>(({ audioRef }) => {
  const bars = useAudioThreeVisualizer(audioRef);
  const sphere = useRef<any>(null);
  const light = useRef<any>(null);
  const [down, setDown] = useState(false);
  const [hovered, setHovered] = useState(false);
  const theme = useTheme();
  const { isDarkMode } = useThemeMode();

  useFrame((state) => {
    light.current.position.x = state.mouse.x * 20;
    light.current.position.y = state.mouse.y * 20;
  });

  const [{ color, ambient, metalness, distort, scale }] = useSpring(
    () => ({
      ambient: isDarkMode ? 0.4 : 1,
      color: theme.colorPrimary,
      distort: Number(bars[1] / 200),
      metalness: isDarkMode ? 0.4 : 0.1,
      scale: bars.filter(Boolean)?.length > 0 ? Number(bars[1] / 200) + 0.5 : 1,
    }),
    [isDarkMode, hovered, down, bars],
  );

  return (
    <>
      <PerspectiveCamera fov={75} makeDefault position={[0, 0, 4]}>
        <a.ambientLight intensity={ambient} />
        <a.pointLight color={theme.colorPrimary} intensity={2} position-z={-15} ref={light} />
      </PerspectiveCamera>
      <Suspense fallback={null}>
        <a.mesh
          onPointerDown={() => setDown(true)}
          onPointerOut={() => setHovered(false)}
          onPointerOver={() => setHovered(true)}
          onPointerUp={() => {
            setDown(false);
          }}
          ref={sphere}
          scale={scale}
        >
          {/* eslint-disable-next-line react/no-unknown-property */}
          <sphereBufferGeometry args={[1, 64, 64]} />
          {/* @ts-ignore */}
          <AnimatedMaterial
            clearcoat={1}
            clearcoatRoughness={0}
            color={color}
            distort={distort}
            metalness={metalness}
          />
        </a.mesh>
        <Environment blur={0.5} preset="studio" />
      </Suspense>
    </>
  );
});

export default ThreeVisualizer;
