"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// Enhanced Crystal Star with more organic shape
function CrystalStar({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number; targetX: number; targetY: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  const starRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Create enhanced star geometry - more organic crystal shape
  const starGeometry = useMemo(() => {
    // Use a more complex geometry - combine octahedron with torus for organic feel
    const geometry = new THREE.OctahedronGeometry(1.4, 1);
    const positions = geometry.attributes.position.array as Float32Array;
    
    // Modify vertices to create more organic star shape
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      // Create organic distortion based on position
      const noise = Math.sin(x * 2) * Math.cos(y * 2) * 0.1;
      const elongation = 1 + Math.abs(y) * 0.3;
      
      positions[i] = x * elongation + noise;
      positions[i + 1] = y * (1.2 + noise);
      positions[i + 2] = z * elongation + noise;
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  // Rings with different geometries
  const ring1Geometry = useMemo(() => new THREE.TorusGeometry(2.4, 0.03, 32, 200), []);
  const ring2Geometry = useMemo(() => new THREE.TorusGeometry(3.0, 0.02, 32, 200), []);
  const ring3Geometry = useMemo(() => new THREE.TorusGeometry(3.6, 0.015, 32, 200), []);

  useFrame((state) => {
    if (!groupRef.current || !starRef.current) return;

    const time = state.clock.getElapsedTime();
    const { x, y, targetX, targetY } = mousePosition.current;

    // Smooth interpolation for mouse movement
    mousePosition.current.x += (targetX - x) * 0.05;
    mousePosition.current.y += (targetY - y) * 0.05;

    // Apply rotation based on mouse with smooth easing
    const targetRotationX = mousePosition.current.y * 0.4;
    const targetRotationY = mousePosition.current.x * 0.4;
    
    groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.03;
    groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.03;

    // Add subtle floating animation
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.1;

    // Star gentle rotation
    if (starRef.current) {
      starRef.current.rotation.y = time * 0.1;
      starRef.current.rotation.z = Math.sin(time * 0.2) * 0.05;
    }

    // Inner core counter-rotation
    if (innerRef.current) {
      innerRef.current.rotation.y = -time * 0.3;
      innerRef.current.rotation.x = time * 0.15;
    }

    // Core pulse
    if (coreRef.current) {
      const pulse = 1 + Math.sin(time * 2) * 0.05;
      coreRef.current.scale.setScalar(pulse);
    }

    // Rings with varied rotation speeds and tilts
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.3) * 0.3;
      ring1Ref.current.rotation.y = time * 0.4;
      ring1Ref.current.rotation.z = Math.cos(time * 0.2) * 0.1;
    }
    
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = Math.PI / 3 + Math.cos(time * 0.25) * 0.2;
      ring2Ref.current.rotation.y = Math.sin(time * 0.15) * 0.5;
      ring2Ref.current.rotation.z = time * 0.25;
    }
    
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = Math.PI / 6 + Math.sin(time * 0.2) * 0.15;
      ring3Ref.current.rotation.y = -time * 0.2;
      ring3Ref.current.rotation.z = Math.cos(time * 0.3) * 0.2;
    }

    // Glow pulse
    if (glowRef.current) {
      const glowPulse = 1 + Math.sin(time * 1.5) * 0.1;
      glowRef.current.scale.setScalar(glowPulse);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Glow Sphere */}
      <mesh ref={glowRef} scale={[4, 4, 4]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#1e40af"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main Crystal Star - Outer Shell */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.2}>
        <mesh ref={starRef} geometry={starGeometry}>
          <MeshTransmissionMaterial
            backside
            backsideThickness={3}
            thickness={2}
            chromaticAberration={0.25}
            anisotropy={0.8}
            distortion={0.15}
            distortionScale={0.8}
            temporalDistortion={0.15}
            iridescence={1}
            iridescenceIOR={1.8}
            color="#60a5fa"
            attenuationColor="#1e3a5f"
            attenuationDistance={8}
            ior={2.4}
            roughness={0.02}
            metalness={0.15}
            transmission={0.95}
            transparent
            opacity={1}
          />
        </mesh>
      </Float>

      {/* Middle Layer */}
      <mesh ref={innerRef} scale={0.75}>
        <octahedronGeometry args={[1.2, 1]} />
        <meshPhysicalMaterial
          color="#3b82f6"
          emissive="#1e40af"
          emissiveIntensity={0.4}
          metalness={0.6}
          roughness={0.1}
          transmission={0.7}
          thickness={1.5}
          ior={1.9}
          transparent
          opacity={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Inner Core - Bright Center */}
      <mesh ref={coreRef} scale={0.4}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color="#dbeafe"
          emissive="#60a5fa"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.05}
          transmission={0.5}
          thickness={0.8}
          ior={2.2}
          toneMapped={false}
        />
      </mesh>

      {/* Primary Orbit Ring - Thick and prominent */}
      <mesh ref={ring1Ref} geometry={ring1Geometry}>
        <meshPhysicalMaterial
          color="#60a5fa"
          metalness={0.95}
          roughness={0.02}
          transparent
          opacity={0.8}
          emissive="#3b82f6"
          emissiveIntensity={0.3}
          clearcoat={1}
        />
      </mesh>

      {/* Secondary Ring - Medium */}
      <mesh ref={ring2Ref} geometry={ring2Geometry}>
        <meshPhysicalMaterial
          color="#93c5fd"
          metalness={0.9}
          roughness={0.05}
          transparent
          opacity={0.5}
          emissive="#60a5fa"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Tertiary Ring - Thin and subtle */}
      <mesh ref={ring3Ref} geometry={ring3Geometry}>
        <meshPhysicalMaterial
          color="#bfdbfe"
          metalness={0.85}
          roughness={0.08}
          transparent
          opacity={0.35}
          emissive="#93c5fd"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Sparkles effect */}
      <Sparkles
        count={30}
        scale={6}
        size={3}
        speed={0.4}
        color="#60a5fa"
        opacity={0.6}
      />

      {/* Floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <FloatingParticle key={i} index={i} />
      ))}

      {/* Light trails */}
      <ParticleTrail />
    </group>
  );
}

// Enhanced floating particles with trails
function FloatingParticle({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const angle = (index / 8) * Math.PI * 2;
  const radius = 4.5 + Math.random() * 1.5;
  const speed = 0.2 + Math.random() * 0.3;
  const yOffset = (Math.random() - 0.5) * 4;

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    const x = Math.cos(angle + time * speed) * radius;
    const z = Math.sin(angle + time * speed) * radius;
    const y = yOffset + Math.sin(time * 0.4 + index) * 0.8;

    ref.current.position.set(x, y, z);
    ref.current.rotation.x = time * 0.8;
    ref.current.rotation.y = time * 0.5;
    
    // Pulsing scale
    const scale = 0.08 + Math.sin(time * 2 + index) * 0.03;
    ref.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial
        color="#60a5fa"
        emissive="#3b82f6"
        emissiveIntensity={0.6}
        metalness={0.9}
        roughness={0.1}
        transmission={0.6}
        thickness={0.3}
        transparent
        opacity={0.9}
        toneMapped={false}
      />
    </mesh>
  );
}

// Particle trail effect
function ParticleTrail() {
  const trailRef = useRef<THREE.Points>(null);
  const particleCount = 50;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!trailRef.current) return;
    const time = state.clock.getElapsedTime();
    trailRef.current.rotation.y = time * 0.05;
    trailRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <points ref={trailRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#60a5fa"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Ambient floating lights
function AmbientLights() {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (light1Ref.current) {
      light1Ref.current.position.x = Math.sin(time * 0.5) * 4;
      light1Ref.current.position.z = Math.cos(time * 0.5) * 4;
    }
    if (light2Ref.current) {
      light2Ref.current.position.x = Math.sin(time * 0.7 + Math.PI) * 4;
      light2Ref.current.position.y = Math.cos(time * 0.3) * 2;
    }
  });

  return (
    <>
      <pointLight ref={light1Ref} position={[4, 2, 4]} intensity={2} color="#60a5fa" distance={10} decay={2} />
      <pointLight ref={light2Ref} position={[-4, -2, -4]} intensity={1.5} color="#3b82f6" distance={10} decay={2} />
    </>
  );
}

// Scene setup
function Scene() {
  const mousePosition = useRef({ 
    x: 0, 
    y: 0, 
    targetX: 0, 
    targetY: 0 
  });

  useEffect(() => {
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position -1 to 1
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

    const handleMouseDown = () => {
      isDragging = true;
      document.body.style.cursor = "grabbing";
    };

    const handleMouseUp = () => {
      isDragging = false;
      document.body.style.cursor = "default";
    };

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
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#60a5fa" />
      <directionalLight position={[-5, -5, -5]} intensity={0.6} color="#3b82f6" />
      <pointLight position={[0, 0, 4]} intensity={3} color="#87ceeb" distance={15} decay={2} />
      <AmbientLights />
      <Environment preset="city" />
      <CrystalStar mousePosition={mousePosition} />
    </>
  );
}

// Main export component
export function CrystalShape3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

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
      className="relative w-full h-[500px] lg:h-[600px] cursor-move group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        background: `
          radial-gradient(800px circle at var(--cursor-x, 50%) var(--cursor-y, 50%), 
          rgba(59, 130, 246, 0.12), 
          transparent 40%)
        `,
      }}
    >
      {/* Enhanced grid background pattern */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)`,
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 8], fov: 40 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
      >
        <Scene />
      </Canvas>

      {/* Floating UI hint */}
      <div 
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-gray-800 transition-all duration-300 ${
          isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <span>Trascina per ruotare</span>
        </div>
        <div className="w-px h-4 bg-gray-700" />
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>Muovi per esplorare</span>
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#22c55e]/30 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#22c55e]/30 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#22c55e]/30 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#22c55e]/30 rounded-br-lg" />
    </div>
  );
}
