import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Constellation({ color = "#6366f1", count = 120 }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (THREE.MathUtils.randFloatSpread(10));
      p[i * 3 + 1] = (THREE.MathUtils.randFloatSpread(10));
      p[i * 3 + 2] = (THREE.MathUtils.randFloatSpread(10));
    }
    return p;
  }, [count]);

  const linePositions = useMemo(() => {
    const l = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = points[i * 3] - points[j * 3];
        const dy = points[i * 3 + 1] - points[j * 3 + 1];
        const dz = points[i * 3 + 2] - points[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 1.5) {
          l.push(points[i * 3], points[i * 3 + 1], points[i * 3 + 2]);
          l.push(points[j * 3], points[j * 3 + 1], points[j * 3 + 2]);
        }
      }
    }
    return new Float32Array(l);
  }, [points, count]);

  const groupRef = useRef();
  const timer = useMemo(() => new THREE.Timer(), []);

  useFrame((state) => {
    timer.update();
    const time = timer.getElapsed();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.05;
      groupRef.current.rotation.x = time * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length / 3}
            array={points}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.02} color={color} transparent opacity={0.4} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.1} />
      </lineSegments>
    </group>
  );
}

function AmbientGlow() {
  return (
    <mesh>
      <sphereGeometry args={[8, 32, 32]} />
      <meshBasicMaterial color="#4f46e5" transparent opacity={0.02} side={THREE.BackSide} />
    </mesh>
  );
}

export function InteractiveBackground({ type = "student" }) {
  const color = type === "admin" ? "#818cf8" : "#6366f1";
  const [isLight, setIsLight] = useState(document.body.classList.contains("light-theme"));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.body.classList.contains("light-theme"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`fixed inset-0 -z-10 transition-colors duration-700 ${isLight ? "bg-slate-50" : "bg-[#010101]"}`}>
      <div className={`absolute inset-0 transition-opacity duration-700 ${isLight ? "bg-[radial-gradient(circle_at_50%_50%,#e2e8f0_0%,transparent_70%)] opacity-100" : "bg-[radial-gradient(circle_at_50%_50%,#1e1b4b_0%,transparent_70%)] opacity-40"}`} />
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={isLight ? 1.5 : 0.5} />
        <Constellation color={isLight ? "#4f46e5" : color} />
        <AmbientGlow />
      </Canvas>
    </div>
  );
}
