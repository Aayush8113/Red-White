import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = () => {
  const ref = useRef();

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Stars ref={ref} radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
};

// We add a subtle glowing ambient mesh to complement the stars
const GlowingOrb = ({ position, color }) => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.01;
  });

  return (
    <mesh position={position} ref={meshRef}>
      <sphereGeometry args={[10, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.1} blending={THREE.AdditiveBlending} />
    </mesh>
  );
};

const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none bg-[#050510]">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ParticleField />
        <GlowingOrb position={[-15, 10, -20]} color="#00f0ff" />
        <GlowingOrb position={[15, -10, -20]} color="#ff0055" />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
