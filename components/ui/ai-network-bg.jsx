"use client";

import { useEffect, useRef } from "react";

/**
 * Animated neural-network background: nodes + connecting lines.
 * Tuned for clear visibility on light institute sections.
 */
export function AiNetworkBg({
  className = "",
  nodeCount = 58,
  connectionDistance = 160,
  lineColor = "139, 0, 0",
  accentColor = "13, 122, 66",
  opacity = 0.72,
  /** "light" fades toward white (default). "dark" fades toward the parent bg. */
  tone = "light",
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let nodes = [];
    let frameId = 0;
    let width = 0;
    let height = 0;
    let running = true;

    const init = (w, h) => {
      const count = Math.min(
        nodeCount,
        Math.max(30, Math.floor((w * h) / 14000)),
      );
      nodes = Array.from({ length: count }, (_, i) => {
        const isAccent = Math.random() > 0.75;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * (reduceMotion ? 0 : 0.24),
          vy: (Math.random() - 0.5) * (reduceMotion ? 0 : 0.24),
          r: Math.random() * 1.8 + 1.4,
          accent: isAccent,
          pulse: Math.random() * Math.PI * 2,
          hub: i % 5 === 0,
        };
      });
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init(width, height);
    };

    const draw = (time) => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      // Circuit grid
      const grid = 40;
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${lineColor}, ${0.07 * opacity})`;
      ctx.beginPath();
      for (let x = 0; x <= width; x += grid) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
      }
      for (let y = 0; y <= height; y += grid) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
      }
      ctx.stroke();

      // Diagonal construction lines
      ctx.strokeStyle = `rgba(${lineColor}, ${0.045 * opacity})`;
      ctx.beginPath();
      for (let i = -height; i < width; i += grid * 2.5) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i + height, height);
      }
      ctx.stroke();

      // Connections
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > connectionDistance) continue;

          const strength = 1 - dist / connectionDistance;
          const useAccent = a.accent || b.accent;
          const rgb = useAccent ? accentColor : lineColor;
          const alpha = (0.12 + strength * 0.32) * opacity;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
          ctx.lineWidth = a.hub || b.hub ? 1.35 : 0.95;
          ctx.stroke();

          // Data pulse along stronger links
          if (!reduceMotion && strength > 0.48 && (i + j) % 4 === 0) {
            const t = (time * 0.0004 + i * 0.09) % 1;
            const px = a.x + (b.x - a.x) * t;
            const py = a.y + (b.y - a.y) * t;
            ctx.beginPath();
            ctx.arc(px, py, 1.7, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb}, ${0.55 * opacity})`;
            ctx.fill();
          }
        }
      }

      // Nodes
      for (const node of nodes) {
        if (!reduceMotion) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
          node.x = Math.max(0, Math.min(width, node.x));
          node.y = Math.max(0, Math.min(height, node.y));
        }

        const pulse = reduceMotion
          ? 1
          : 0.85 + Math.sin(time * 0.0022 + node.pulse) * 0.15;
        const rgb = node.accent ? accentColor : lineColor;
        const core = node.r * pulse;

        // Outer glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, core * (node.hub ? 3.4 : 2.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${(node.hub ? 0.1 : 0.055) * opacity})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, core, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${0.68 * opacity})`;
        ctx.fill();

        // Highlight
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(0.7, core * 0.35), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.55 * opacity})`;
        ctx.fill();
      }

      if (!reduceMotion) {
        frameId = requestAnimationFrame(draw);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    if (reduceMotion) {
      draw(0);
    } else {
      frameId = requestAnimationFrame(draw);
    }

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      ro.disconnect();
    };
  }, [nodeCount, connectionDistance, lineColor, accentColor, opacity]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* Soft edge fade so cards stay primary */}
      <div
        className={`absolute inset-0 ${
          tone === "dark"
            ? "bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]"
            : "bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(255,255,255,0.38)_100%)]"
        }`}
      />
    </div>
  );
}
