"use client";

import { motion } from "framer-motion";

interface AnimatedImagePlaceholderProps {
  category: string;
  className?: string;
}

export function AnimatedImagePlaceholder({ category, className = "" }: AnimatedImagePlaceholderProps) {
  const getAnimation = () => {
    switch (category) {
      case "ai_news":
        return <AINewsAnimation />;
      case "casi_duso":
        return <UseCaseAnimation />;
      case "web_dev":
        return <WebDevAnimation />;
      case "opinioni":
        return <OpinionAnimation />;
      case "tools":
        return <ToolsAnimation />;
      case "tutorial":
        return <TutorialAnimation />;
      default:
        return <DefaultAnimation />;
    }
  };

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      {getAnimation()}
    </div>
  );
}

// ─── AI News Animation ────────────────────────────────────────────────────────

function AINewsAnimation() {
  return (
    <svg viewBox="0 0 400 225" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
        <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill="url(#aiGrad)" />
      
      {/* Neural network nodes */}
      {[
        [100, 60], [200, 40], [300, 60],
        [80, 110], [200, 90], [320, 110],
        [120, 160], [200, 140], [280, 160],
        [200, 190]
      ].map((pos, i) => (
        <motion.circle
          key={i}
          cx={pos[0]}
          cy={pos[1]}
          r="6"
          fill="url(#neuralGrad)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
      
      {/* Connection lines */}
      <motion.path
        d="M100,60 L200,90 L300,60 M80,110 L200,140 L320,110 M120,160 L200,190 L280,160 M200,40 L200,90 L200,140"
        stroke="url(#neuralGrad)"
        strokeWidth="1"
        fill="none"
        strokeOpacity="0.3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  );
}

// ─── Use Case Animation ───────────────────────────────────────────────────────

function UseCaseAnimation() {
  return (
    <svg viewBox="0 0 400 225" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="useCaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>
        <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
          <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill="url(#useCaseGrad)" />
      
      {/* Central hub */}
      <motion.circle
        cx="200"
        cy="112"
        r="30"
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
        strokeOpacity="0.5"
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <circle cx="200" cy="112" r="15" fill="#10b981" fillOpacity="0.3" />
      
      {/* Orbiting nodes */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 200 + Math.cos(rad) * 80;
        const y = 112 + Math.sin(rad) * 50;
        return (
          <motion.g key={i}>
            <motion.line
              x1="200"
              y1="112"
              x2={x}
              y2={y}
              stroke="#10b981"
              strokeWidth="1"
              strokeOpacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.1 }}
            />
            <motion.circle
              cx={x}
              cy={y}
              r="8"
              fill="#10b981"
              fillOpacity="0.5"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
          </motion.g>
        );
      })}
    </svg>
  );
}

// ─── Web Dev Animation ────────────────────────────────────────────────────────

function WebDevAnimation() {
  return (
    <svg viewBox="0 0 400 225" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="webGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c2d12" />
          <stop offset="100%" stopColor="#9a3412" />
        </linearGradient>
        <linearGradient id="codeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill="url(#webGrad)" />
      
      {/* Code lines */}
      {[
        { x: 60, y: 60, w: 120 },
        { x: 60, y: 85, w: 200 },
        { x: 60, y: 110, w: 160 },
        { x: 60, y: 135, w: 240 },
        { x: 60, y: 160, w: 100 },
        { x: 80, y: 100, w: 80, indent: true },
        { x: 80, y: 125, w: 140, indent: true },
      ].map((line, i) => (
        <motion.rect
          key={i}
          x={line.x}
          y={line.y}
          width={line.w}
          height="8"
          rx="4"
          fill="url(#codeGrad)"
          fillOpacity={0.3 + (i % 3) * 0.1}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: line.w, opacity: 1 }}
          transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity, repeatDelay: 3 }}
        />
      ))}
      
      {/* Cursor */}
      <motion.rect
        x="280"
        y="100"
        width="3"
        height="18"
        fill="#f97316"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </svg>
  );
}

// ─── Opinion Animation ────────────────────────────────────────────────────────

function OpinionAnimation() {
  return (
    <svg viewBox="0 0 400 225" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="opinionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#831843" />
          <stop offset="100%" stopColor="#9d174d" />
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill="url(#opinionGrad)" />
      
      {/* Speech bubbles */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ellipse cx="150" cy="100" rx="60" ry="40" fill="#f43f5e" fillOpacity="0.3" />
        <polygon points="130,135 140,160 160,130" fill="#f43f5e" fillOpacity="0.3" />
      </motion.g>
      
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <ellipse cx="260" cy="130" rx="50" ry="35" fill="#f43f5e" fillOpacity="0.2" />
        <polygon points="280,160 290,180 260,155" fill="#f43f5e" fillOpacity="0.2" />
      </motion.g>
      
      {/* Thought lines */}
      {[180, 200, 220].map((x, i) => (
        <motion.circle
          key={i}
          cx={x}
          cy="60"
          r={3 + i * 2}
          fill="#f43f5e"
          fillOpacity={0.3}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </svg>
  );
}

// ─── Tools Animation ──────────────────────────────────────────────────────────

function ToolsAnimation() {
  return (
    <svg viewBox="0 0 400 225" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="toolsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0e7490" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill="url(#toolsGrad)" />
      
      {/* Gears */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "150px 112px" }}
      >
        <circle cx="150" cy="112" r="40" fill="none" stroke="#22d3ee" strokeWidth="2" strokeOpacity="0.5" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 150 + Math.cos(rad) * 30;
          const y1 = 112 + Math.sin(rad) * 30;
          const x2 = 150 + Math.cos(rad) * 50;
          const y2 = 112 + Math.sin(rad) * 50;
          return (
            <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#22d3ee" strokeWidth="8" strokeOpacity="0.5" />
          );
        })}
      </motion.g>
      
      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "260px 112px" }}
      >
        <circle cx="260" cy="112" r="30" fill="none" stroke="#06b6d4" strokeWidth="2" strokeOpacity="0.4" />
        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 260 + Math.cos(rad) * 22;
          const y1 = 112 + Math.sin(rad) * 22;
          const x2 = 260 + Math.cos(rad) * 38;
          const y2 = 112 + Math.sin(rad) * 38;
          return (
            <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#06b6d4" strokeWidth="6" strokeOpacity="0.4" />
          );
        })}
      </motion.g>
    </svg>
  );
}

// ─── Tutorial Animation ───────────────────────────────────────────────────────

function TutorialAnimation() {
  return (
    <svg viewBox="0 0 400 225" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="tutorialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#581c87" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill="url(#tutorialGrad)" />
      
      {/* Book/Document shape */}
      <motion.rect
        x="140"
        y="50"
        width="120"
        height="140"
        rx="4"
        fill="#8b5cf6"
        fillOpacity="0.2"
        stroke="#8b5cf6"
        strokeWidth="2"
        strokeOpacity="0.5"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Lines */}
      {[
        { x: 155, y: 80, w: 90 },
        { x: 155, y: 105, w: 90 },
        { x: 155, y: 130, w: 70 },
        { x: 155, y: 155, w: 80 },
      ].map((line, i) => (
        <motion.rect
          key={i}
          x={line.x}
          y={line.y}
          width={line.w}
          height="6"
          rx="3"
          fill="#8b5cf6"
          fillOpacity="0.4"
          initial={{ width: 0 }}
          animate={{ width: line.w }}
          transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
        />
      ))}
      
      {/* Checkmark */}
      <motion.path
        d="M155 175 L175 190 L245 150"
        stroke="#22c55e"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      />
    </svg>
  );
}

// ─── Default Animation ────────────────────────────────────────────────────────

function DefaultAnimation() {
  return (
    <svg viewBox="0 0 400 225" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="defaultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#312e81" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill="url(#defaultGrad)" />
      
      {/* Abstract shapes */}
      <motion.circle
        cx="200"
        cy="112"
        r="60"
        fill="none"
        stroke="#6366f1"
        strokeWidth="2"
        strokeOpacity="0.3"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="200"
        cy="112"
        r="40"
        fill="none"
        stroke="#6366f1"
        strokeWidth="2"
        strokeOpacity="0.4"
        animate={{ scale: [1, 1.15, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="200"
        cy="112"
        r="20"
        fill="#6366f1"
        fillOpacity="0.3"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}
