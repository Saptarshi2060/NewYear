
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SnowParticles: React.FC = () => {
  const count = 300;
  const mesh = useRef<THREE.Points>(null);

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = Math.random() * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sc[i] = Math.random();
    }
    return [pos, sc];
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      const { array } = mesh.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        // Fall down
        array[i * 3 + 1] -= 0.01;
        // Sway horizontally
        array[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.002;
        
        if (array[i * 3 + 1] < -2) {
          array[i * 3 + 1] = 8;
        }
      }
      mesh.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={scales.length}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#fce7f3"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

export default SnowParticles;
