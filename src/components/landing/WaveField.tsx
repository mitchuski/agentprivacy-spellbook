'use client';

import { useEffect, useRef } from 'react';

interface WaveFieldConfig {
  lines?: number;
  alpha?: number;
  lineWidth?: number;
  speed?: number;
  reverse?: boolean;
}

export default function WaveField({
  lines = 45,
  alpha = 0.22,
  lineWidth = 0.7,
  speed = 0.008,
  reverse = false,
}: WaveFieldConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function getY(x: number, time: number, lineIndex: number, totalLines: number): number {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      const cx = w / 2;
      const cy = h / 2;
      const prog = lineIndex / totalLines;
      const xNorm = (x - cx) / cx;

      let y = cy;
      // Multiple overlapping sinusoids create the manifold effect
      y += Math.sin(xNorm * 3.5 + time * 0.4) * 40 * (1 - Math.abs(prog - 0.5) * 1.8);
      y += Math.sin(xNorm * 2.1 - time * 0.3 + prog * 2) * 25;
      y += Math.cos(xNorm * 5 + time * 0.6 + prog * 1.5) * 12;
      // Spread lines vertically based on their index
      y += (prog - 0.5) * h * 0.75;
      return y;
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const pts = 200;

      ctx.clearRect(0, 0, w, h);

      // Coral (#e8523a) and Cyan (#4dd9e8) — the Swordsman/Mage axis
      const c1 = reverse ? { r: 77, g: 217, b: 232 } : { r: 232, g: 82, b: 58 };
      const c2 = reverse ? { r: 232, g: 82, b: 58 } : { r: 77, g: 217, b: 232 };

      for (let i = 0; i < lines; i++) {
        const mix = i / lines;
        const r = Math.round(c1.r + (c2.r - c1.r) * mix);
        const g = Math.round(c1.g + (c2.g - c1.g) * mix);
        const b = Math.round(c1.b + (c2.b - c1.b) * mix);

        ctx.beginPath();
        for (let j = 0; j <= pts; j++) {
          const x = (j / pts) * w;
          const y = getY(x, tRef.current, i, lines);
          j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      if (!prefersReducedMotion) {
        tRef.current += speed;
      }
      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    draw();

    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [lines, alpha, lineWidth, speed, reverse]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}
