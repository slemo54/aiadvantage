"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  color?: "blue" | "purple" | "orange" | "green" | "yellow";
  className?: string;
}

const colorStyles = {
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
  green: "bg-green-100 text-green-600",
  yellow: "bg-yellow-100 text-yellow-700",
};

export function Badge({ children, color = "blue", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
        colorStyles[color],
        className
      )}
    >
      {children}
    </span>
  );
}
