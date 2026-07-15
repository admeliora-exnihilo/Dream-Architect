import { useEffect, useRef } from "react";

interface NeuralSignalWaveProps {
  frequency: number; // Hz, e.g. 8.6
  amplitude: number; // %, e.g. 72
  clarity: "HIGH" | "STABLE" | "ERRATIC" | "CRITICAL";
}

export default function NeuralSignalWave({ frequency, amplitude, clarity }: NeuralSignalWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    // Handle canvas resizing
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const draw = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, width, height);

      // Draw background horizontal grid line
      ctx.strokeStyle = "rgba(168, 85, 247, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // vertical lines grid
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw wave
      ctx.beginPath();
      ctx.lineWidth = 2;

      // Select stroke color based on clarity
      let gradient = ctx.createLinearGradient(0, 0, width, 0);
      if (clarity === "CRITICAL" || clarity === "ERRATIC") {
        gradient.addColorStop(0, "rgba(244, 63, 94, 0.2)");
        gradient.addColorStop(0.5, "rgba(244, 63, 94, 0.85)");
        gradient.addColorStop(1, "rgba(244, 63, 94, 0.2)");
      } else {
        gradient.addColorStop(0, "rgba(6, 182, 212, 0.2)");
        gradient.addColorStop(0.5, "rgba(6, 182, 212, 0.85)");
        gradient.addColorStop(1, "rgba(6, 182, 212, 0.2)");
      }
      ctx.strokeStyle = gradient;

      // Adjust wave characteristics based on props
      const waveFreq = (frequency / 10) * 0.04;
      const waveAmp = (amplitude / 100) * (height / 2.5);

      for (let x = 0; x < width; x++) {
        // Multi-harmonic neural waves: combine a primary sine wave, a secondary alpha wave, and noise
        const primary = Math.sin(x * waveFreq + phase) * waveAmp;
        const alpha = Math.sin(x * (waveFreq * 0.4) + phase * 0.5) * (waveAmp * 0.3);
        const theta = Math.sin(x * (waveFreq * 2.2) + phase * 1.5) * (waveAmp * 0.15);
        
        let noise = 0;
        if (clarity === "CRITICAL") {
          noise = (Math.random() - 0.5) * 12;
        } else if (clarity === "ERRATIC") {
          noise = (Math.random() - 0.5) * 6;
        } else {
          noise = (Math.random() - 0.5) * 1.5;
        }

        const y = height / 2 + primary + alpha + theta + noise;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Add a subtle outer glow shadow to the line
      ctx.shadowBlur = clarity === "CRITICAL" ? 15 : 8;
      ctx.shadowColor = clarity === "CRITICAL" ? "rgba(244, 63, 94, 0.6)" : "rgba(6, 182, 212, 0.6)";

      // Draw another overlapping purple subharmonic wave
      ctx.shadowBlur = 0; // reset shadow
      ctx.beginPath();
      ctx.strokeStyle = "rgba(168, 85, 247, 0.25)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x++) {
        const primary2 = Math.sin(x * (waveFreq * 1.5) - phase * 0.8) * (waveAmp * 0.5);
        const noise2 = (Math.random() - 0.5) * 2;
        const y2 = height / 2 + primary2 + noise2;
        if (x === 0) {
          ctx.moveTo(x, y2);
        } else {
          ctx.lineTo(x, y2);
        }
      }
      ctx.stroke();

      // Increment phase over time
      const speed = (frequency / 8.6) * 0.05;
      phase += speed;

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [frequency, amplitude, clarity]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full block rounded border border-cyan-500/10 bg-cyan-950/5"
      id="neural-signal-canvas"
    />
  );
}
