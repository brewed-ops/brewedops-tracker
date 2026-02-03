import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";
import { motion } from "framer-motion";

export const Vortex = (props) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const offscreenRef = useRef(null);
  const animationFrameId = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const particleCount = props.particleCount || 700;
  const particlePropCount = 9;
  const particlePropsLength = particleCount * particlePropCount;
  const rangeY = props.rangeY || 100;
  const baseTTL = 50;
  const rangeTTL = 150;
  const baseSpeed = props.baseSpeed || 0.0;
  const rangeSpeed = props.rangeSpeed || 1.5;
  const baseRadius = props.baseRadius || 1;
  const rangeRadius = props.rangeRadius || 2;
  const baseHue = props.baseHue || 220;
  const rangeHue = props.rangeHue ?? 100;
  const baseSaturation = props.baseSaturation ?? 100;
  const baseLightness = props.baseLightness ?? 60;
  const noiseSteps = 3;
  const xOff = 0.00125;
  const yOff = 0.00125;
  const zOff = 0.0005;
  const backgroundColor = props.backgroundColor || "#000000";
  
  const tickRef = useRef(0);
  const noise3DRef = useRef(null);
  const particlePropsRef = useRef(new Float32Array(particlePropsLength));
  const centerRef = useRef([0, 0]);

  const TAU = 2 * Math.PI;
  const rand = (n) => n * Math.random();
  const randRange = (n) => n - rand(2 * n);
  const fadeInOut = (t, m) => {
    let hm = 0.5 * m;
    return Math.abs(((t + hm) % m) - hm) / hm;
  };
  const lerp = (n1, n2, speed) => (1 - speed) * n1 + speed * n2;

  const initParticle = (i, width, height) => {
    if (!width || !height) return;

    const x = rand(width);
    const y = centerRef.current[1] + randRange(rangeY);
    const vx = 0;
    const vy = 0;
    const life = 0;
    const ttl = baseTTL + rand(rangeTTL);
    const speed = baseSpeed + rand(rangeSpeed);
    const radius = baseRadius + rand(rangeRadius);
    const hue = baseHue + rand(rangeHue);

    particlePropsRef.current.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
  };

  const initParticles = (width, height) => {
    tickRef.current = 0;
    particlePropsRef.current = new Float32Array(particlePropsLength);
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      initParticle(i, width, height);
    }
  };

  const drawParticle = (x, y, x2, y2, life, ttl, radius, hue, ctx) => {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = radius;
    ctx.strokeStyle = `hsla(${hue},${baseSaturation}%,${baseLightness}%,${fadeInOut(life, ttl)})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };

  const checkBounds = (x, y, width, height) => {
    return x > width || x < 0 || y > height || y < 0;
  };

  const updateParticle = (i, ctx, width, height) => {
    if (!width || !height || !noise3DRef.current) return;

    const particleProps = particlePropsRef.current;
    let i2 = 1 + i,
      i3 = 2 + i,
      i4 = 3 + i,
      i5 = 4 + i,
      i6 = 5 + i,
      i7 = 6 + i,
      i8 = 7 + i,
      i9 = 8 + i;

    let x = particleProps[i];
    let y = particleProps[i2];
    const n = noise3DRef.current(x * xOff, y * yOff, tickRef.current * zOff) * noiseSteps * TAU;
    const vx = lerp(particleProps[i3], Math.cos(n), 0.5);
    const vy = lerp(particleProps[i4], Math.sin(n), 0.5);
    let life = particleProps[i5];
    const ttl = particleProps[i6];
    const speed = particleProps[i7];
    const x2 = x + vx * speed;
    const y2 = y + vy * speed;
    const radius = particleProps[i8];
    const hue = particleProps[i9];

    drawParticle(x, y, x2, y2, life, ttl, radius, hue, ctx);

    life++;

    particleProps[i] = x2;
    particleProps[i2] = y2;
    particleProps[i3] = vx;
    particleProps[i4] = vy;
    particleProps[i5] = life;

    if (checkBounds(x, y, width, height) || life > ttl) {
      initParticle(i, width, height);
    }
  };

  const drawParticles = (ctx, width, height) => {
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      updateParticle(i, ctx, width, height);
    }
  };

  const draw = (canvas, ctx, width, height) => {
    tickRef.current++;
    
    const offscreen = offscreenRef.current;
    const offCtx = offscreen?.getContext("2d");
    if (!offCtx) return;

    // Clear offscreen canvas (transparent)
    offCtx.clearRect(0, 0, width, height);
    
    // Draw particles to offscreen canvas
    drawParticles(offCtx, width, height);

    // Clear main canvas and fill with background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Apply glow effect to offscreen canvas and draw to main
    // First pass: blur glow
    ctx.save();
    ctx.filter = "blur(8px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(offscreen, 0, 0);
    ctx.restore();

    // Second pass: softer glow
    ctx.save();
    ctx.filter = "blur(4px) brightness(150%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(offscreen, 0, 0);
    ctx.restore();

    // Final pass: sharp particles on top
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(offscreen, 0, 0);
    ctx.restore();

    animationFrameId.current = window.requestAnimationFrame(() =>
      draw(canvas, ctx, width, height)
    );
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set actual canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Create offscreen canvas for particles
    offscreenRef.current = document.createElement("canvas");
    offscreenRef.current.width = dimensions.width;
    offscreenRef.current.height = dimensions.height;

    // Update center
    centerRef.current = [dimensions.width / 2, dimensions.height / 2];

    // Initialize noise and particles
    noise3DRef.current = createNoise3D();
    initParticles(dimensions.width, dimensions.height);

    // Start animation
    draw(canvas, ctx, dimensions.width, dimensions.height);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [dimensions]);

  return (
    <div
      className={cn("relative w-full", props.containerClassName)}
      style={{
        minHeight: "500px",
        backgroundColor: backgroundColor,
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        ref={containerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: backgroundColor,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
          }}
        />
      </motion.div>
      <div 
        className={cn("relative z-10", props.className)}
        style={{ position: "relative", zIndex: 10 }}
      >
        {props.children}
      </div>
    </div>
  );
};

export default Vortex;
