"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  href?: string;
  icon?: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  href,
  icon,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-[#3B5BFF] text-white hover:bg-[#2a4aee] focus:ring-[#3B5BFF] shadow-lg shadow-blue-500/25",
    secondary:
      "bg-[#1a1a4e] text-white hover:bg-[#252560] focus:ring-[#1a1a4e]",
    outline:
      "border-2 border-[#3B5BFF] text-[#3B5BFF] hover:bg-[#3B5BFF] hover:text-white focus:ring-[#3B5BFF]",
    ghost: "text-[#3B5BFF] hover:bg-blue-50 focus:ring-[#3B5BFF]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      href={href}
      onClick={onClick}
      type={href ? undefined : type}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className, disabled && "opacity-50 cursor-not-allowed")}
      whileHover={disabled ? undefined : { scale: 1.02, y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {children}
      {icon && <span className="ml-1">{icon}</span>}
    </Component>
  );
}
