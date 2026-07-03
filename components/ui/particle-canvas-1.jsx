"use client";

import { useEffect, useRef } from "react";

const PARTICLE_DENSITY = 0.00016;
const BG_PARTICLE_DENSITY = 0.00006;
const MOUSE_RADIUS = 180;
const RETURN_SPEED = 0.032;
const DAMPING = 0.93;
const REPULSION_STRENGTH = 1.05;

const randomRange = (min, max) => Math.random() * (max - min) + min;

export function ParticleCanvas({ className = "" }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const particles = [];
    const backgroundParticles = [];
    const mouse = { x: -1000, y: -1000, isActive: false };
    let frameId = 0;

    const initParticles = (width, height) => {
      particles.length = 0;
      backgroundParticles.length = 0;

      const particleCount = Math.min(220, Math.floor(width * height * PARTICLE_DENSITY));
      const bgCount = Math.min(120, Math.floor(width * height * BG_PARTICLE_DENSITY));

      for (let i = 0; i < particleCount; i += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height;

        particles.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: 0,
          vy: 0,
          size: randomRange(1.2, 2.6),
          color: Math.random() > 0.88 ? "#00803d" : "#990000",
          angle: Math.random() * Math.PI * 2,
        });
      }

      for (let i = 0; i < bgCount; i += 1) {
        backgroundParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          size: randomRange(0.5, 1.3),
          alpha: randomRange(0.12, 0.3),
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles(width, height);
    };

    const draw = (time) => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      const pulseOpacity = Math.sin(time * 0.0008) * 0.015 + 0.05;
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.max(width, height) * 0.95,
      );
      gradient.addColorStop(0, `rgba(153, 0, 0, ${pulseOpacity})`);
      gradient.addColorStop(0.42, `rgba(0, 128, 61, ${pulseOpacity * 0.8})`);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (const p of backgroundParticles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const twinkle = Math.sin(time * 0.002 + p.phase) * 0.5 + 0.5;
        ctx.globalAlpha = p.alpha * (0.35 + 0.65 * twinkle);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        if (mouse.isActive && distance < MOUSE_RADIUS) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
          const repulsion = force * REPULSION_STRENGTH;
          p.vx -= forceDirectionX * repulsion * 4.8;
          p.vy -= forceDirectionY * repulsion * 4.8;
        }

        p.vx += (p.originX - p.x) * RETURN_SPEED;
        p.vy += (p.originY - p.y) * RETURN_SPEED;

        p.vx *= DAMPING;
        p.vy *= DAMPING;
        p.angle += 0.02;
        p.x += p.vx + Math.cos(p.angle) * 0.05;
        p.y += p.vy + Math.sin(p.angle * 0.9) * 0.05;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        const velocity = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const opacity = Math.min(0.24 + velocity * 0.16, 0.95);
        ctx.fillStyle =
          p.color === "#00803d"
            ? `rgba(0, 128, 61, ${opacity})`
            : `rgba(153, 0, 0, ${opacity})`;
        ctx.fill();
      }

      frameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isActive = true;
    };

    const handleMouseLeave = () => {
      mouse.isActive = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    resize();
    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
