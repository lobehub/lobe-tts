import { Environment, Lightformer } from '@react-three/drei';
import { LayerMaterial } from 'lamina';
import { memo } from 'react';
import * as THREE from 'three';

export default memo(() => {
  return (
    <Environment resolution={2048}>
      {/* Light A */}
      <Lightformer
        castShadow={false}
        color={'#ffd2ae'}
        form="rect"
        intensity={20}
        position={
          new THREE.Vector3().setFromSphericalCoords(
            3, // distance
            0.25, // phi
            -1.5, // theta
          ) as any
        }
        receiveShadow={false}
        rotation={[0, 0, 0]}
        scale={[10, 10, 10]}
        target={[0, 0, 0]}
        visible={true}
      >
        <LayerMaterial
          color={'#6868f7'}
          side={THREE.DoubleSide as any}
          toneMapped={false}
          transparent
        />
      </Lightformer>

      {/* procedural_scrim B */}
      <Lightformer
        castShadow={false}
        form="rect"
        intensity={0.3}
        position={
          new THREE.Vector3().setFromSphericalCoords(
            3, // distance
            2.5, // phi
            1.5, // theta
          ) as any
        }
        receiveShadow={false}
        rotation={[0, 0, 0]}
        scale={[10, 10, 10]}
        target={[0, 0, 0]}
        visible={true}
      >
        <LayerMaterial
          color={'#ffd2ae'}
          side={THREE.DoubleSide as any}
          toneMapped={false}
          transparent
        />
      </Lightformer>
    </Environment>
  );
});
