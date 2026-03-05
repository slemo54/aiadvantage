"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

const C_EMERALD   = new THREE.Color("#22c55e");
const C_LIGHT     = new THREE.Color("#4ade80");
const C_DARK      = new THREE.Color("#052e16");
const C_MID       = new THREE.Color("#166534");

function CrystalStar({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const groupRef  = useRef<THREE.Group>(null);
  const innerRef  = useRef<THREE.Mesh>(null);
  const ring1Ref  = useRef<THREE.Mesh>(null);
  const ring2Ref  = useRef<THREE.Mesh>(null);
  const ring3Ref  = useRef<THREE.Mesh>(null);

  /* ── Geometries ── */
  const starGeo = useMemo(() => {
    const g = new THREE.OctahedronGeometry(1.2, 1);
    const pos = g.attributes.position.array as Float32Array;
    for (let i = 0; i < pos.length; i += 3) {
      const len = Math.sqrt(pos[i]**2 + pos[i+1]**2 + pos[i+2]**2);
      if (len > 1.3) {
        pos[i]   *= 1.45;
        pos[i+1] *= 1.45;
        pos[i+2] *= 1.45;
      }
    }
    g.computeVertexNormals();
    return g;
  }, []);

  const ringGeo1 = useMemo(() => new THREE.TorusGeometry(2.2, 0.025, 16, 120), []);
  const ringGeo2 = useMemo(() => new THREE.TorusGeometry(2.9, 0.018, 16, 120), []);
  const ringGeo3 = useMemo(() => new THREE.TorusGeometry(3.5, 0.012, 16, 120), []);

  useFrame(({ clock }) => {
    if (!groupRef.current || !innerRef.current) return;
    const t  = clock.getElapsedTime();
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    groupRef.current.rotation.x += (my * 0.4 - groupRef.current.rotation.x) * 0.04;
    groupRef.current.rotation.y += (mx * 0.4 - groupRef.current.rotation.y + t * 0.12) * 0.04;

    innerRef.current.rotation.y = -t * 0.6;
    innerRef.current.rotation.z =  t * 0.25;

    if (ring1Ref.current) { ring1Ref.current.rotation.x = Math.PI/2 + Math.sin(t*0.5)*0.25; ring1Ref.current.rotation.y = t*0.35; }
    if (ring2Ref.current) { ring2Ref.current.rotation.x = Math.PI/3 + Math.cos(t*0.4)*0.25; ring2Ref.current.rotation.z = t*0.22; }
    if (ring3Ref.current) { ring3Ref.current.rotation.x = Math.PI/6 + Math.sin(t*0.3)*0.2;  ring3Ref.current.rotation.y =-t*0.18; }
  });

  return (
    <group ref={groupRef}>
      {/* ── Main crystal — solid emissive emerald ── */}
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.35}>
        <mesh geometry={starGeo}>
          <meshPhysicalMaterial
            color={C_MID}
            emissive={C_EMERALD}
            emissiveIntensity={1.8}
            metalness={0.6}
            roughness={0.08}
            transparent
            opacity={0.92}
          />
        </mesh>
        {/* Wireframe overlay for crystal edges */}
        <mesh geometry={starGeo}>
          <meshBasicMaterial color={C_LIGHT} wireframe transparent opacity={0.35} />
        </mesh>
      </Float>

      {/* ── Inner core ── */}
      <mesh ref={innerRef} scale={0.55}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color={C_DARK}
          emissive={C_LIGHT}
          emissiveIntensity={3.0}
          metalness={0.9}
          roughness={0.02}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* ── Rings ── */}
      <mesh ref={ring1Ref} geometry={ringGeo1}>
        <meshPhysicalMaterial color={C_EMERALD} emissive={C_EMERALD} emissiveIntensity={1.2} metalness={0.9} roughness={0.05} transparent opacity={0.75} />
      </mesh>
      <mesh ref={ring2Ref} geometry={ringGeo2}>
        <meshPhysicalMaterial color={C_LIGHT}   emissive={C_EMERALD} emissiveIntensity={0.8} metalness={0.85} roughness={0.1} transparent opacity={0.55} />
      </mesh>
      <mesh ref={ring3Ref} geometry={ringGeo3}>
        <meshBasicMaterial color={C_LIGHT} transparent opacity={0.35} />
      </mesh>

      {/* ── Particles ── */}
      {Array.from({ length: 8 }).map((_, i) => <Particle key={i} index={i} />)}
    </group>
  );
}

function Particle({ index }: { index: number }) {
  const ref    = useRef<THREE.Mesh>(null);
  const angle  = (index / 8) * Math.PI * 2;
  const radius = 3.8 + (index % 3) * 0.6;
  const speed  = 0.25 + (index % 4) * 0.12;
  const yo     = (index - 4) * 0.5;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.set(
      Math.cos(angle + t * speed) * radius,
      yo + Math.sin(t * 0.5 + index) * 0.6,
      Math.sin(angle + t * speed) * radius,
    );
    ref.current.rotation.x = t * 0.6;
    ref.current.rotation.y = t * 0.4;
  });

  return (
    <mesh ref={ref} scale={0.07 + (index % 3) * 0.025}>
      <octahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial
        color={C_EMERALD}
        emissive={C_EMERALD}
        emissiveIntensity={2.0}
        metalness={0.8}
        roughness={0.1}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function Scene() {
  const mouseRef = useRef({ x: 0, y: 0 });
  useThree();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x:  (e.clientX / window.innerWidth)  * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    let dragging = false, sx = 0, sy = 0;
    const onDown = (e: MouseEvent) => { dragging = true; sx = e.clientX; sy = e.clientY; document.body.style.cursor = "grabbing"; };
    const onUp   = () => { dragging = false; document.body.style.cursor = "default"; };
    const onDrag = (e: MouseEvent) => {
      if (!dragging) return;
      const dx = (e.clientX - sx) / window.innerWidth;
      const dy = (e.clientY - sy) / window.innerHeight;
      gsap.to(mouseRef.current, { x: Math.max(-1, Math.min(1, mouseRef.current.x + dx*2)), y: Math.max(-1, Math.min(1, mouseRef.current.y - dy*2)), duration: 0.3, ease: "power2.out" });
      sx = e.clientX; sy = e.clientY;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);
    window.addEventListener("mousemove", onDrag);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mousedown", onDown); window.removeEventListener("mouseup", onUp); window.removeEventListener("mousemove", onDrag); };
  }, []);

  return (
    <>
      <ambientLight intensity={0.05} />
      <pointLight position={[0, 0, 4]}   intensity={6}  color="#22c55e" distance={12} decay={2} />
      <pointLight position={[3, 3, 2]}   intensity={4}  color="#4ade80" distance={10} decay={2} />
      <pointLight position={[-3,-3, 2]}  intensity={3}  color="#16a34a" distance={10} decay={2} />
      <pointLight position={[0, 0,-3]}   intensity={2}  color="#22c55e" distance={8}  decay={2} />
      <CrystalStar mouseRef={mouseRef} />
    </>
  );
}

export function CrystalShape3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const fn = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--cx", `${e.clientX - r.left}px`);
      el.style.setProperty("--cy", `${e.clientY - r.top}px`);
    };
    el.addEventListener("mousemove", fn);
    return () => el.removeEventListener("mousemove", fn);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] lg:h-[600px] cursor-move group"
      style={{ background: "radial-gradient(700px circle at var(--cx,50%) var(--cy,50%), rgba(34,197,94,0.07), transparent 45%), #000" }}
    >
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{ backgroundImage: "linear-gradient(rgba(34,197,94,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,.4) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

      <Canvas camera={{ position: [0,0,7], fov: 45 }} dpr={[1,2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        style={{ background: "#000000" }}>
        <color attach="background" args={["#000000"]} />
        <Scene />
      </Canvas>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span>Drag to rotate</span>
      </div>
    </div>
  );
}
