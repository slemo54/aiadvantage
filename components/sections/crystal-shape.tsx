"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// Emerald green palette
const EMERALD = "#22c55e";
const EMERALD_LIGHT = "#4ade80";
const EMERALD_DARK = "#052e16";
const EMERALD_MID = "#064e3b";

// Crystal Star Geometry Component
function CrystalStar({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number }> }) {
  const starRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const starGeometry = useMemo(() => {
    const geometry = new THREE.OctahedronGeometry(1.2, 0);
    const positions = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      const scale = Math.abs(x) + Math.abs(y) + Math.abs(z) > 1.5 ? 1.5 : 1;
      positions[i] = x * scale;
      positions[i + 1] = y * scale;
      positions[i + 2] = z * scale;
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  const ringGeometry = useMemo(() => new THREE.TorusGeometry(2.2, 0.02, 16, 100), []);
  const ring2Geometry = useMemo(() => new THREE.TorusGeometry(2.8, 0.015, 16, 100), []);
  const ring3Geometry = useMemo(() => new THREE.TorusGeometry(3.4, 0.01, 16, 100), []);

  useFrame((state) => {
    if (!groupRef.current || !starRef.current || !innerRef.current) return;

    const time = state.clock.getElapsedTime();
    const { x, y } = mousePosition.current;

    const targetRotationX = y * 0.3;
    const targetRotationY = x * 0.3;

    groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y + time * 0.1) * 0.05;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.5) * 0.2;
      ring1Ref.current.rotation.y = time * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI / 3 + Math.cos(time * 0.4) * 0.2;
      ring2Ref.current.rotation.z = time * 0.2;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = Math.PI / 6 + Math.sin(time * 0.3) * 0.2;
      ring3Ref.current.rotation.y = -time * 0.15;
    }

    innerRef.current.rotation.y = -time * 0.5;
    innerRef.current.rotation.z = time * 0.2;
  });

  return (
    <group ref={groupRef}>
      {/* Main Crystal Star — emerald green */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh ref={starRef} geometry={starGeometry}>
          <MeshTransmissionMaterial
            backside
            backsideThickness={2}
            thickness={1.5}
            chromaticAberration={0.08}
            anisotropy={0.5}
            distortion={0.1}
            distortionScale={0.5}
            temporalDistortion={0.1}
            iridescence={0.6}
            iridescenceIOR={1.3}
            color={EMERALD}
            attenuationColor={EMERALD_DARK}
            attenuationDistance={5}
            ior={2.4}
            roughness={0.05}
            metalness={0.1}
            transmission={1}
            transparent
            opacity={1}
          />
        </mesh>
      </Float>

      {/* Inner Core */}
      <mesh ref={innerRef} scale={0.6}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color={EMERALD_LIGHT}
          emissive={EMERALD_MID}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.1}
          transmission={0.6}
          thickness={1}
          ior={2.0}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Orbiting Rings */}
      <mesh ref={ring1Ref} geometry={ringGeometry}>
        <meshPhysicalMaterial
          color={EMERALD}
          metalness={0.9}
          roughness={0.05}
          transparent
          opacity={0.6}
          emissive={EMERALD}
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh ref={ring2Ref} geometry={ring2Geometry}>
        <meshPhysicalMaterial
          color={EMERALD_LIGHT}
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0.4}
          emissive={EMERALD}
          emissiveIntensity={0.2}
        />
      </mesh>

      <mesh ref={ring3Ref} geometry={ring3Geometry}>
        <meshPhysicalMaterial
          color="#86efac"
          metalness={0.7}
          roughness={0.15}
          transparent
          opacity={0.3}
          emissive={EMERALD_LIGHT}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Floating particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <FloatingParticle key={i} index={i} />
      ))}
    </group>
  );
}

function FloatingParticle({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const angle = (index / 6) * Math.PI * 2;
  const radius = 4 + Math.random() * 1.5;
  const speed = 0.3 + Math.random() * 0.4;
  const yOffset = (Math.random() - 0.5) * 3;

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    const x = Math.cos(angle + time * speed) * radius;
    const z = Math.sin(angle + time * speed) * radius;
    const y = yOffset + Math.sin(time * 0.5 + index) * 0.5;
    ref.current.position.set(x, y, z);
    ref.current.rotation.x = time * 0.5;
    ref.current.rotation.y = time * 0.3;
  });

  return (
    <mesh ref={ref} scale={0.08 + Math.random() * 0.05}>
      <octahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial
        color={EMERALD}
        emissive={EMERALD}
        emissiveIntensity={0.6}
        metalness={0.9}
        roughness={0.1}
        transmission={0.8}
        thickness={0.5}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function Scene() {
  const mousePosition = useRef({ x: 0, y: 0 });
  useThree();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      document.body.style.cursor = "grabbing";
    };

    const handleMouseUp = () => {
      isDragging = false;
      document.body.style.cursor = "default";
    };

    const handleDragMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = (e.clientX - startX) / window.innerWidth;
      const deltaY = (e.clientY - startY) / window.innerHeight;
      gsap.to(mousePosition.current, {
        x: Math.max(-1, Math.min(1, mousePosition.current.x + deltaX * 2)),
        y: Math.max(-1, Math.min(1, mousePosition.current.y - deltaY * 2)),
        duration: 0.3,
        ease: "power2.out",
      });
      startX = e.clientX;
      startY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleDragMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleDragMove);
    };
  }, []);

  return (
    <>
      <ambientLight intensity={0.2} color="#000000" />
      <directionalLight position={[5, 5, 5]} intensity={1.8} color={EMERALD} />
      <directionalLight position={[-5, -5, -5]} intensity={0.8} color={EMERALD_LIGHT} />
      <pointLight position={[0, 0, 3]} intensity={2.5} color={EMERALD_LIGHT} distance={10} decay={2} />
      <pointLight position={[0, 2, -2]} intensity={1} color={EMERALD_DARK} distance={8} decay={2} />
      <CrystalStar mousePosition={mousePosition} />
    </>
  );
}

export function CrystalShape3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      container.style.setProperty("--cursor-x", `${x}px`);
      container.style.setProperty("--cursor-y", `${y}px`);
    };
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] lg:h-[600px] cursor-move group bg-black"
      style={{
        background: `radial-gradient(600px circle at var(--cursor-x, 50%) var(--cursor-y, 50%), rgba(34,197,94,0.06), transparent 40%), #000000`,
      }}
    >
      {/* Subtle green grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,197,94,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ background: "#000000" }}
      >
        <color attach="background" args={["#000000"]} />
        <Scene />
      </Canvas>

      {/* Drag hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        <span>Drag to rotate</span>
      </div>
    </div>
  );
}
