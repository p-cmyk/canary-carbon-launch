import { useEffect, useRef } from "react";

type WaveformProps = {
  getLevel: () => number;
  active: boolean;
  color: string;
  className?: string;
};

// Onda de voz tipo app de iPhone: barras redondeadas que se desplazan;
// en reposo queda una línea de puntos.
export const Waveform = ({ getLevel, active, color, className }: WaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(active);
  const getLevelRef = useRef(getLevel);
  const colorRef = useRef(color);
  activeRef.current = active;
  getLevelRef.current = getLevel;
  colorRef.current = color;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const history: number[] = [];
    let smoothed = 0;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w > 0 && (canvas.width !== w * dpr || canvas.height !== h * dpr)) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const step = 5; // barra de 2px + hueco de 3px
      const slots = Math.max(1, Math.floor(w / step));
      const raw = activeRef.current ? getLevelRef.current() : 0;
      smoothed += (raw - smoothed) * 0.35;
      history.push(smoothed);
      while (history.length > slots) history.shift();

      ctx.strokeStyle = colorRef.current;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      for (let i = 0; i < history.length; i++) {
        const x = w - (history.length - i) * step + step / 2;
        const amp = Math.max(0.8, history[i] * (h / 2 - 2));
        ctx.beginPath();
        ctx.moveTo(x, h / 2 - amp);
        ctx.lineTo(x, h / 2 + amp);
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};
