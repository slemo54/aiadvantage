"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// Brand green colors
const GREEN_COLORS = {
  primary: "#22c55e",
  light: "#4ade80",
  dark: "#166534",
  glow: "#22c55e",
  accent: "#86efac",
};

// Optimized Crystal Star Component
function CrystalStar({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number; targetX: number; targetY: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  const starRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Optimized geometry - reduced segments
  const starGeometry = useMemo(() => {
    const geometry = new THREE.OctahedronGeometry(1.4, 0); // Reduced from 1 to 0
    const positions = geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const elongation = 1 + Math.abs(y) * 0.3;
      positions[i] = x * elongation;
      positions[i + 1] = y * 1.2;
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  const coreGeometry = useMemo(() => new THREE.OctahedronGeometry(0.7, 0), []);

  // Reduced ring segments for performance
  const ring1Geometry = useMemo(() => new THREE.TorusGeometry(2.4, 0.03, 16, 80), []);
  const ring2Geometry = useMemo(() => new THREE.TorusGeometry(3.0, 0.02, 16, 80), []);
  const ring3Geometry = useMemo(() => new THREE.TorusGeometry(3.6, 0.015, 16, 80), []);

  useFrame((state) => {
    if (!groupRef.current || !starRef.current) return;

    const time = state.clock.getElapsedTime();
    const { x, y, targetX, targetY } = mousePosition.current;

    mousePosition.current.x += (targetX - x) * 0.05;
    mousePosition.current.y += (targetY - y) * 0.05;

    const targetRotationX = mousePosition.current.y * 0.4;
    const targetRotationY = mousePosition.current.x * 0.4;
    
    groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.03;
    groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.03;

    groupRef.current.position.y = Math.sin(time * 0.5) * 0.1;

    if (starRef.current) {
      starRef.current.rotation.y = time * 0.1;
      starRef.current.rotation.z = Math.sin(time * 0.2) * 0.05;
    }

    if (innerRef.current) {
      innerRef.current.rotation.y = -time * 0.3;
      innerRef.current.rotation.x = time * 0.15;
    }

    if (coreRef.current) {
      const pulse = 1 + Math.sin(time * 2) * 0.05;
      coreRef.current.scale.setScalar(pulse);
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.3) * 0.3;
      ring1Ref.current.rotation.y = time * 0.4;
    }
    
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI / 3 + Math.cos(time * 0.25) * 0.2;
      ring2Ref.current.rotation.z = time * 0.25;
    }
    
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = Math.PI / 6 + Math.sin(time * 0.2) * 0.15;
      ring3Ref.current.rotation.y = -time * 0.2;
    }

    if (glowRef.current) {
      const glowPulse = 1 + Math.sin(time * 1.5) * 0.1;
      glowRef.current.scale.setScalar(glowPulse);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Glow Sphere */}
      <mesh ref={glowRef} scale={[4, 4, 4]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color={GREEN_COLORS.dark}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main Crystal Star - Outer Shell */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.2}>
        <mesh ref={starRef} geometry={starGeometry}>
          <meshPhysicalMaterial
            color={GREEN_COLORS.primary}
            emissive={GREEN_COLORS.dark}
            emissiveIntensity={0.3}
            metalness={0.4}
            roughness={0.1}
            transmission={0.8}
            thickness={2}
            ior={2.0}
            transparent
            opacity={0.9}
            clearcoat={1}
            clearcoatRoughness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Float>

      {/* Middle Layer */}
      <mesh ref={innerRef} scale={0.75}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshPhysicalMaterial
          color={GREEN_COLORS.light}
          emissive={GREEN_COLORS.primary}
          emissiveIntensity={0.4}
          metalness={0.5}
          roughness={0.15}
          transmission={0.6}
          thickness={1.5}
          ior={1.8}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Inner Core */}
      <mesh ref={coreRef} scale={0.4}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color={GREEN_COLORS.accent}
          emissive={GREEN_COLORS.primary}
          emissiveIntensity={0.9}
          metalness={0.8}
          roughness={0.05}
          toneMapped={false}
        />
      </mesh>

      {/* Primary Ring */}
      <mesh ref={ring1Ref} geometry={ring1Geometry}>
        <meshPhysicalMaterial
          color={GREEN_COLORS.primary}
          metalness={0.9}
          roughness={0.05}
          transparent
          opacity={0.7}
          emissive={GREEN_COLORS.primary}
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Secondary Ring */}
      <mesh ref={ring2Ref} geometry={ring2Geometry}>
        <meshPhysicalMaterial
          color={GREEN_COLORS.light}
          metalness={0.85}
          roughness={0.08}
          transparent
          opacity={0.45}
          emissive={GREEN_COLORS.light}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Tertiary Ring */}
      <mesh ref={ring3Ref} geometry={ring3Geometry}>
        <meshPhysicalMaterial
          color={GREEN_COLORS.accent}
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0.3}
          emissive={GREEN_COLORS.accent}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Reduced sparkles for performance */}
      <Sparkles
        count={20}
        scale={5}
        size={2}
        speed={0.3}
        color={GREEN_COLORS.primary}
        opacity={0.5}
      />

      {/* Reduced floating particles */}
      {Array.from({ length: 5 }).map((_, i) => (
        <FloatingParticle key={i} index={i} />
      ))}
    </group>
  );
}

// Optimized floating particle
function FloatingParticle({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const angle = (index / 5) * Math.PI * 2;
  const radius = 4.5 + (index * 0.5);
  const speed = 0.2 + (index * 0.05);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    const x = Math.cos(angle + time * speed) * radius;
    const z = Math.sin(angle + time * speed) * radius;
    const y = Math.sin(time * 0.4 + index) * 0.6;

    ref.current.position.set(x, y, z);
    ref.current.rotation.x = time * 0.5;
    ref.current.rotation.y = time * 0.3;
    
    const scale = 0.08 + Math.sin(time * 2 + index) * 0.02;
    ref.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial
        color={GREEN_COLORS.primary}
        emissive={GREEN_COLORS.light}
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.1}
        transparent
        opacity={0.8}
        toneMapped={false}
      />
    </mesh>
  );
}

// Optimized ambient lights
function AmbientLights() {
  const light1Ref = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (light1Ref.current) {
      light1Ref.current.position.x = Math.sin(time * 0.5) * 4;
      light1Ref.current.position.z = Math.cos(time * 0.5) * 4;
    }
  });

  return (
    <pointLight 
      ref={light1Ref} 
      position={[4, 2, 4]} 
      intensity={1.5} 
      color={GREEN_COLORS.primary} 
      distance={10} 
      decay={2} 
    />
  );
}

// Scene setup
function Scene() {
  const mousePosition = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      mousePosition.current.targetX = x;
      mousePosition.current.targetY = y;

      if (isDragging) {
        const deltaX = (e.clientX - lastX) / window.innerWidth * 4;
        const deltaY = (e.clientY - lastY) / window.innerHeight * 4;
        
        gsap.to(mousePosition.current, {
          targetX: Math.max(-1.5, Math.min(1.5, mousePosition.current.targetX + deltaX)),
          targetY: Math.max(-1.5, Math.min(1.5, mousePosition.current.targetY - deltaY)),
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
        });
      }
      
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const handleMouseDown = () => { isDragging = true; document.body.style.cursor = "grabbing"; };
    const handleMouseUp = () => { isDragging = false; document.body.style.cursor = "default"; };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} color={GREEN_COLORS.primary} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color={GREEN_COLORS.dark} />
      <pointLight position={[0, 0, 4]} intensity={2} color={GREEN_COLORS.light} distance={15} decay={2} />
      <AmbientLights />
      <Environment preset="city" />
      <CrystalStar mousePosition={mousePosition} />
    </>
  );
}

// Main export
export function CrystalShape3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      container.style.setProperty("--cursor-x", `${e.clientX - rect.left}px`);
      container.style.setProperty("--cursor-y", `${e.clientY - rect.top}px`);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[500px] lg:h-[600px] cursor-move group"
      style={{
        background: `
          radial-gradient(800px circle at var(--cursor-x, 50%) var(--cursor-y, 50%), 
          rgba(34, 197, 94, 0.1), 
          transparent 40%)
        `,
      }}
    >
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 8], fov: 40 }}
        dpr={[1, 1.5]} // Reduced from 2 for performance
        gl={{ 
          antialias: false, // Disabled for performance
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        performance={{ min: 0.5 }} // Allow frame skipping
      >
        <Scene />
      </Canvas>

      {/* UI hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-gray-800 opacity-0 group-hover:opacity-100 transition-all">
        <span className="text-sm text-gray-400">Trascina per ruotare</span>
      </div>

      {/* Corner accents - green */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#22c55e]/40 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#22c55e]/40 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#22c55e]/40 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#22c55e]/40 rounded-br-lg" />
    </div>
  );
}
