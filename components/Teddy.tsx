
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCursor, Text } from '@react-three/drei';
import * as THREE from 'three';

interface TeddyProps {
  isOpened: boolean;
  onOpen: () => void;
}

export const Teddy: React.FC<TeddyProps> = ({ isOpened, onOpen }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const armLRef = useRef<THREE.Mesh>(null);
  const armRRef = useRef<THREE.Mesh>(null);
  const envelopeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Breathing animation
    if (bodyRef.current) {
      bodyRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.02);
    }
    
    // Blinking logic
    const blink = Math.sin(time * 3) > 0.98 ? 0.1 : 1;

    // Movement when opened
    if (isOpened) {
      if (armLRef.current) armLRef.current.rotation.z = Math.PI / 4 + Math.sin(time * 4) * 0.1;
      if (armRRef.current) armRRef.current.rotation.z = -Math.PI / 4 - Math.sin(time * 4) * 0.1;
      if (envelopeRef.current) {
        envelopeRef.current.position.y = 1.2 + Math.sin(time * 2) * 0.1;
        envelopeRef.current.rotation.y += 0.01;
      }
    } else {
      // Idle arms
      if (armLRef.current) armLRef.current.rotation.z = 0.5 + Math.sin(time) * 0.05;
      if (armRRef.current) armRRef.current.rotation.z = -0.5 - Math.sin(time) * 0.05;
    }
  });

  const bearColor = "#d97706"; // Warm brown
  const snoutColor = "#fde68a"; // Lighter cream
  const earInnerColor = "#fbbf24";

  return (
    <group>
      {/* Body */}
      <group ref={bodyRef}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshToonMaterial color={bearColor} />
        </mesh>
        
        {/* Head */}
        <group ref={headRef} position={[0, 1.4, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.45, 32, 32]} />
            <meshToonMaterial color={bearColor} />
          </mesh>
          
          {/* Snout */}
          <mesh position={[0, -0.05, 0.35]}>
            <sphereGeometry args={[0.15, 20, 20]} />
            <meshToonMaterial color={snoutColor} />
          </mesh>
          
          {/* Nose */}
          <mesh position={[0, 0, 0.48]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshToonMaterial color="#111827" />
          </mesh>

          {/* Eyes */}
          <mesh position={[-0.15, 0.1, 0.38]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshToonMaterial color="#111827" />
          </mesh>
          <mesh position={[0.15, 0.1, 0.38]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshToonMaterial color="#111827" />
          </mesh>

          {/* Ears */}
          <group position={[-0.35, 0.35, 0]}>
            <mesh rotation={[0, 0, 0.5]}>
              <sphereGeometry args={[0.15, 20, 20]} />
              <meshToonMaterial color={bearColor} />
            </mesh>
            <mesh position={[0, 0, 0.05]} rotation={[0, 0, 0.5]}>
              <sphereGeometry args={[0.08, 20, 20]} />
              <meshToonMaterial color={earInnerColor} />
            </mesh>
          </group>
          <group position={[0.35, 0.35, 0]}>
            <mesh rotation={[0, 0, -0.5]}>
              <sphereGeometry args={[0.15, 20, 20]} />
              <meshToonMaterial color={bearColor} />
            </mesh>
            <mesh position={[0, 0, 0.05]} rotation={[0, 0, -0.5]}>
              <sphereGeometry args={[0.08, 20, 20]} />
              <meshToonMaterial color={earInnerColor} />
            </mesh>
          </group>
        </group>

        {/* Arms */}
        <mesh ref={armLRef} position={[-0.6, 0.8, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.3, 10, 20]} />
          <meshToonMaterial color={bearColor} />
        </mesh>
        <mesh ref={armRRef} position={[0.6, 0.8, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.3, 10, 20]} />
          <meshToonMaterial color={bearColor} />
        </mesh>

        {/* Legs */}
        <mesh position={[-0.3, 0.1, 0]} castShadow>
          <capsuleGeometry args={[0.15, 0.2, 10, 20]} />
          <meshToonMaterial color={bearColor} />
        </mesh>
        <mesh position={[0.3, 0.1, 0]} castShadow>
          <capsuleGeometry args={[0.15, 0.2, 10, 20]} />
          <meshToonMaterial color={bearColor} />
        </mesh>
      </group>

      {/* Envelope */}
      <group 
        ref={envelopeRef} 
        position={[0, 0.9, 0.5]} 
        onPointerOver={() => !isOpened && setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        {!isOpened && (
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.4, 0.05]} />
            <meshToonMaterial color="#fff1f2" />
          </mesh>
        )}
        
        {/* Heart Stamp */}
        {!isOpened && (
          <mesh position={[0, 0, 0.03]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.1, 0.1, 0.02]} />
            <meshToonMaterial color="#f43f5e" />
          </mesh>
        )}

        {isOpened && (
           <group>
             <mesh>
               <boxGeometry args={[0.8, 0.5, 0.05]} />
               <meshStandardMaterial color="#fff" emissive="#f472b6" emissiveIntensity={1} transparent opacity={0.8} />
             </mesh>
             <pointLight intensity={2} color="#f472b6" />
           </group>
        )}
      </group>
    </group>
  );
};
