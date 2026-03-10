import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnimatedHeroBackground, FloatingParticles, AnimatedGrid } from "./animated-hero";
import React from "react";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe("AnimatedHero Components", () => {
  describe("AnimatedHeroBackground", () => {
    it("renders with default props", () => {
      const { container } = render(<AnimatedHeroBackground />);
      const mainDiv = container.firstChild as HTMLElement;

      expect(mainDiv).toHaveClass("absolute", "inset-0", "overflow-hidden");
      // Check for default gradient class
      const gradientDiv = mainDiv.querySelector(".bg-gradient-to-br");
      expect(gradientDiv).toHaveClass("from-emerald-900/80", "via-zinc-900", "to-zinc-950");
    });

    it("renders with custom props", () => {
      const customGradient = "from-blue-500 to-red-500";
      const customClass = "test-class";
      const { container } = render(
        <AnimatedHeroBackground gradient={customGradient} className={customClass} />
      );

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass(customClass);

      const gradientDiv = mainDiv.querySelector(".bg-gradient-to-br");
      expect(gradientDiv).toHaveClass("from-blue-500", "to-red-500");
    });

    it("renders animated orbs and grid pattern", () => {
      const { container } = render(<AnimatedHeroBackground />);
      // 3 orbs + 1 gradient + 1 grid pattern = 5 children
      // But one is a motion.div which we mocked
      const mainDiv = container.firstChild as HTMLElement;

      // Orbs should have blur-3xl class
      const orbs = mainDiv.querySelectorAll(".blur-3xl");
      expect(orbs).toHaveLength(3);

      // Grid pattern should have background image style
      const gridPattern = Array.from(mainDiv.children).find(child =>
        (child as HTMLElement).style.backgroundImage.includes("data:image/svg+xml")
      );
      expect(gridPattern).toBeDefined();
    });
  });

  describe("FloatingParticles", () => {
    it("renders the default number of particles", () => {
      const { container } = render(<FloatingParticles />);
      // Default count is 20
      const particles = container.querySelectorAll(".rounded-full.bg-white\\/20");
      expect(particles).toHaveLength(20);
    });

    it("renders a specific number of particles", () => {
      const count = 10;
      const { container } = render(<FloatingParticles count={count} />);
      const particles = container.querySelectorAll(".rounded-full.bg-white\\/20");
      expect(particles).toHaveLength(count);
    });
  });

  describe("AnimatedGrid", () => {
    it("renders grid and scan line", () => {
      const { container } = render(<AnimatedGrid className="custom-grid" />);
      const mainDiv = container.firstChild as HTMLElement;

      expect(mainDiv).toHaveClass("custom-grid", "absolute", "inset-0");

      // Grid background div
      const gridBg = Array.from(mainDiv.children).find(child =>
        (child as HTMLElement).style.backgroundImage.includes("linear-gradient")
      );
      expect(gridBg).toBeDefined();
      expect(gridBg).toHaveStyle({ backgroundSize: "40px 40px" });

      // Scan line
      const scanLine = mainDiv.querySelector(".bg-gradient-to-r");
      expect(scanLine).toHaveClass("h-px", "from-transparent", "via-indigo-500/50");
    });
  });
});
