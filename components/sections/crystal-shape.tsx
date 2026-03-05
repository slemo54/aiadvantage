"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// Crystal Star Geometry Component
function CrystalStar({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number }> }) {
  const starRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Create star geometry (octahedron-based)
  const starGeometry = useMemo(() => {
    const geometry = new THREE.OctahedronGeometry(1.2, 0);
    // Modify vertices to create star shape
    const positions = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      // Elongate points
      const scale = Math.abs(x) + Math.abs(y) + Math.abs(z) > 1.5 ? 1.5 : 1;
      positions[i] = x * scale;
      positions[i + 1] = y * scale;
      positions[i + 2] = z * scale;
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  // Torus ring geometry for orbits
  const ringGeometry = useMemo(() => new THREE.TorusGeometry(2.2, 0.02, 16, 100), []);
  const ring2Geometry = useMemo(() => new THREE.TorusGeometry(2.8, 0.015, 16, 100), []);
  const ring3Geometry = useMemo(() => new THREE.TorusGeometry(3.4, 0.01, 16, 100), []);

  useFrame((state) => {
    if (!groupRef.current || !starRef.current || !innerRef.current) return;

    const time = state.clock.getElapsedTime();
    const { x, y } = mousePosition.current;

    // Smooth rotation based on mouse position
    const targetRotationX = y * 0.3;
    const targetRotationY = x * 0.3;

    // Apply mouse influence with lerp
    groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y + time * 0.1) * 0.05;

    // Rings rotation
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

    // Inner counter-rotation
    innerRef.current.rotation.y = -time * 0.5;
    innerRef.current.rotation.z = time * 0.2;
  });

  return (
    <group ref={groupRef}>
      {/* Main Crystal Star */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh ref={starRef} geometry={starGeometry}>
          <MeshTransmissionMaterial
            backside
            backsideThickness={2}
            thickness={1.5}
            chromaticAberration={0.15}
            anisotropy={0.5}
            distortion={0.1}
            distortionScale={0.5}
            temporalDistortion={0.1}
            iridescence={1}
            iridescenceIOR={1.5}
            color="#60a5fa"
            attenuationColor="#1e40af"
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
          color="#87ceeb"
          emissive="#1e3a5f"
          emissiveIntensity={0.3}
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
          color="#60a5fa"
          metalness={0.9}
          roughness={0.05}
          transparent
          opacity={0.6}
          emissive="#3b82f6"
          emissiveIntensity={0.2}
        />
      </mesh>

      <mesh ref={ring2Ref} geometry={ring2Geometry}>
        <meshPhysicalMaterial
          color="#93c5fd"
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0.4}
          emissive="#60a5fa"
          emissiveIntensity={0.15}
        />
      </mesh>

      <mesh ref={ring3Ref} geometry={ring3Geometry}>
        <meshPhysicalMaterial
          color="#dbeafe"
          metalness={0.7}
          roughness={0.15}
          transparent
          opacity={0.3}
          emissive="#93c5fd"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Floating particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <FloatingParticle key={i} index={i} />
      ))}
    </group>
  );
}

// Floating particles around the crystal
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
        color="#60a5fa"
        emissive="#3b82f6"
        emissiveIntensity={0.5}
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

// Background sphere glow
function BackgroundGlow() {
  return (
    <mesh scale={[8, 8, 8]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color="#1e40af"
        transparent
        opacity={0.08}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

// Scene setup
function Scene() {
  const mousePosition = useRef({ x: 0, y: 0 });
  useThree();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position -1 to 1
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    // Add drag effect
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#60a5fa" />
      <directionalLight position={[-5, -5, -5]} intensity={0.8} color="#3b82f6" />
      <pointLight position={[0, 0, 3]} intensity={2} color="#87ceeb" distance={10} decay={2} />
      <Environment preset="city" />
      <BackgroundGlow />
      <CrystalStar mousePosition={mousePosition} />
    </>
  );
}

// Main export component
export function CrystalShape3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cursor glow effect
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
      className="relative w-full h-[500px] lg:h-[600px] cursor-move group"
      style={{
        background: `
          radial-gradient(600px circle at var(--cursor-x, 50%) var(--cursor-y, 50%), 
          rgba(59, 130, 246, 0.08), 
          transparent 40%)
        `,
      }}
    >
      {/* Grid background pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Scene />
      </Canvas>

      {/* Cursor instruction */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        <span>Drag to rotate</span>
      </div>
    </div>
  );
}
