"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

// ─── Animation Variants ───────────────────────────────────────────────────────

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  }
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  }
};

// ─── Animated Components ──────────────────────────────────────────────────────

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "fadeIn" | "fadeInUp" | "fadeInScale" | "slideInLeft" | "slideInRight";
}

export function AnimatedSection({ 
  children, 
  className = "", 
  delay = 0,
  variant = "fadeInUp"
}: AnimatedSectionProps) {
  const variants: Record<string, Variants> = {
    fadeIn,
    fadeInUp,
    fadeInScale,
    slideInLeft,
    slideInRight
  };

  const selectedVariant = variants[variant];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={selectedVariant}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ 
  children, 
  className = "",
  staggerDelay = 0.1
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Hover Effects ────────────────────────────────────────────────────────────

interface HoverScaleProps {
  children: ReactNode;
  className?: string;
  scale?: number;
}

export function HoverScale({ children, className = "", scale = 1.02 }: HoverScaleProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface HoverLiftProps {
  children: ReactNode;
  className?: string;
  y?: number;
}

export function HoverLift({ children, className = "", y = -4 }: HoverLiftProps) {
  return (
    <motion.div
      whileHover={{ y, transition: { duration: 0.2 } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Glow Effects ─────────────────────────────────────────────────────────────

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({ 
  children, 
  className = "",
  glowColor = "rgba(99, 102, 241, 0.3)"
}: GlowCardProps) {
  return (
    <motion.div
      whileHover={{ 
        boxShadow: `0 0 30px ${glowColor}`,
        transition: { duration: 0.3 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Pulse Animation ──────────────────────────────────────────────────────────

interface PulseProps {
  children: ReactNode;
  className?: string;
}

export function Pulse({ children, className = "" }: PulseProps) {
  return (
    <motion.div
      animate={{ 
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Gradient Text Animation ──────────────────────────────────────────────────

interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

export function GradientText({ children, className = "" }: GradientTextProps) {
  return (
    <motion.span
      className={`bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ${className}`}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{ backgroundSize: "200% 200%" }}
    >
      {children}
    </motion.span>
  );
}

// ─── Scroll Progress ───────────────────────────────────────────────────────────

export function ScrollProgress() {
  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[100] h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left"
      style={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0 }}
    />
  );
}
