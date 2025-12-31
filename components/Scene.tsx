
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Teddy } from './Teddy';
import SnowParticles from './SnowParticles';

interface SceneProps {
  isOpened: boolean;
  onOpen: () => void;
}

const Scene: React.FC<SceneProps> = ({ isOpened, onOpen }) => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      // Gentle sway
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      // Gentle floating
      group.current.position.y = -1.2 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  return (
    <group ref={group} position={[0, -1.2, 0]}>
      <Teddy isOpened={isOpened} onOpen={onOpen} />
      <SnowParticles />
    </group>
  );
};

export default Scene;
