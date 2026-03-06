"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ─── Octahedron geometry ────────────────────────────────────────────────────

type Vec3 = [number, number, number];

const VERTICES: Vec3[] = [
  [0, 100, 0],   // top
  [0, -100, 0],  // bottom
  [100, 0, 0],   // right
  [-100, 0, 0],  // left
  [0, 0, 100],   // front
  [0, 0, -100],  // back
];

const EDGES: [number, number][] = [
  [0, 2], [0, 3], [0, 4], [0, 5], // top to equator
  [1, 2], [1, 3], [1, 4], [1, 5], // bottom to equator
  [2, 4], [4, 3], [3, 5], [5, 2], // equator ring
];

// ─── 3D math ────────────────────────────────────────────────────────────────

function rotateY(v: Vec3, a: number): Vec3 {
  const cos = Math.cos(a), sin = Math.sin(a);
  return [v[0] * cos + v[2] * sin, v[1], -v[0] * sin + v[2] * cos];
}

function rotateX(v: Vec3, a: number): Vec3 {
  const cos = Math.cos(a), sin = Math.sin(a);
  return [v[0], v[1] * cos - v[2] * sin, v[1] * sin + v[2] * cos];
}

function project(v: Vec3, fov: number): [number, number] {
  const scale = fov / (fov + v[2]);
  return [v[0] * scale, v[1] * scale];
}

// ─── Component ──────────────────────────────────────────────────────────────

export function BackgroundShape() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const rotationRef = useRef({ x: 0.3, y: 0 });

  const updateProjection = useCallback(() => {
    const { x, y } = rotationRef.current;
    const fov = 300;

    for (let i = 0; i < EDGES.length; i++) {
      const line = lineRefs.current[i];
      if (!line) continue;

      const [ai, bi] = EDGES[i];
      const a = project(rotateX(rotateY(VERTICES[ai], y), x), fov);
      const b = project(rotateX(rotateY(VERTICES[bi], y), x), fov);

      line.setAttribute("x1", String(a[0]));
      line.setAttribute("y1", String(a[1]));
      line.setAttribute("x2", String(b[0]));
      line.setAttribute("y2", String(b[1]));
    }
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Initial projection
    updateProjection();

    // Continuous rotation (skip if reduced motion)
    const rotationTween = prefersReducedMotion
      ? null
      : gsap.to(rotationRef.current, {
          y: "+=6.283",
          x: "+=1.571",
          duration: 25,
          repeat: -1,
          ease: "none",
          onUpdate: updateProjection,
        });

    // Scroll-linked scale
    const scaleTween = gsap.fromTo(
      containerRef.current,
      { scale: 0.6 },
      {
        scale: 2.5,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      }
    );

    return () => {
      rotationTween?.kill();
      scaleTween.scrollTrigger?.kill();
      scaleTween.kill();
    };
  }, [updateProjection]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, willChange: "transform" }}
    >
      <svg
        viewBox="-150 -150 300 300"
        className="w-full h-full opacity-[0.06] sm:opacity-[0.08]"
        style={{ filter: "blur(0.5px)" }}
      >
        {EDGES.map((_, i) => (
          <line
            key={i}
            ref={(el) => { lineRefs.current[i] = el; }}
            stroke="#22c55e"
            strokeWidth="0.8"
          />
        ))}
      </svg>
    </div>
  );
}
