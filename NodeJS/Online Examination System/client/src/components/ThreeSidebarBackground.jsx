import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeSidebarBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    const geometry = new THREE.IcosahedronGeometry(2.25, 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let mouseX = 0;
    let mouseY = 0;
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX = (x - 0.5) * 0.8;
      mouseY = (0.5 - y) * 0.8;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let rafId = 0;
    let last = 0;
    const fps = 30;
    const frameMs = 1000 / fps;
    const animate = (t) => {
      rafId = requestAnimationFrame(animate);
      if (t - last < frameMs) return;
      last = t;

      mesh.rotation.y += 0.003;
      mesh.rotation.x += 0.002;
      mesh.rotation.y += (mouseX - mesh.rotation.y * 0.05) * 0.002;
      mesh.rotation.x += (mouseY - mesh.rotation.x * 0.05) * 0.002;
      renderer.render(scene, camera);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

