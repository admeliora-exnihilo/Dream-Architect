import { useEffect, useRef } from "react";

interface ThreatRadarProps {
  threatLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  nightmareActive: boolean;
}

export default function ThreatRadar({ threatLevel, nightmareActive }: ThreatRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let angle = 0;

    // Generate static red anomalies/blips at random polar angles
    const blips = [
      { r: 0.35, theta: 0.8, size: 4, opacity: 0.8 },
      { r: 0.65, theta: 2.2, size: 5, opacity: 0.4 },
      { r: 0.5, theta: 4.1, size: 4.5, opacity: 0.6 },
      { r: 0.8, theta: 5.5, size: 6, opacity: 0.2 },
    ];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(w, h) / 2 - 12;

      ctx.clearRect(0, 0, w, h);

      // Determine colors based on threat level
      let colorPrimary = "rgba(244, 63, 94, 0.85)"; // Rose/Red for high/critical
      let colorGlow = "rgba(244, 63, 94, 0.15)";
      let sweepColor = "rgba(244, 63, 94, 0.12)";

      if (threatLevel === "LOW") {
        colorPrimary = "rgba(34, 197, 94, 0.85)"; // Green
        colorGlow = "rgba(34, 197, 94, 0.1)";
        sweepColor = "rgba(34, 197, 94, 0.08)";
      } else if (threatLevel === "MEDIUM") {
        colorPrimary = "rgba(245, 158, 11, 0.85)"; // Amber
        colorGlow = "rgba(245, 158, 11, 0.1)";
        sweepColor = "rgba(245, 158, 11, 0.08)";
      }

      // Draw concentric rings
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      for (let i = 1; i <= 4; i++) {
        const ringR = maxR * (i / 4);
        ctx.strokeStyle = i === 4 ? colorPrimary.replace("0.85", "0.25") : colorPrimary.replace("0.85", "0.1");
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw crosshair axes
      ctx.strokeStyle = colorPrimary.replace("0.85", "0.12");
      ctx.beginPath();
      ctx.moveTo(cx - maxR, cy);
      ctx.lineTo(cx + maxR, cy);
      ctx.moveTo(cx, cy - maxR);
      ctx.lineTo(cx, cy + maxR);
      ctx.stroke();

      // Draw radar sweep beam
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      // Sweep gradient arc (trail)
      const segments = 45;
      const sweepDirection = -1; // clockwise
      for (let i = 0; i <= segments; i++) {
        const currentAngle = angle + (i * 0.02 * sweepDirection);
        const x = cx + maxR * Math.cos(currentAngle);
        const y = cy + maxR * Math.sin(currentAngle);
        ctx.strokeStyle = colorPrimary.replace("0.85", String((1 - i / segments) * 0.25));
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      // Draw active sweep line (leading edge)
      const edgeX = cx + maxR * Math.cos(angle);
      const edgeY = cy + maxR * Math.sin(angle);
      ctx.strokeStyle = colorPrimary;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(edgeX, edgeY);
      ctx.stroke();

      // Draw blips
      blips.forEach((blip, index) => {
        const blipX = cx + blip.r * maxR * Math.cos(blip.theta);
        const blipY = cy + blip.r * maxR * Math.sin(blip.theta);

        // Check distance from current sweep angle to light up the blip
        const diff = Math.abs((blip.theta - angle) % (Math.PI * 2));
        let flash = 0;
        if (diff < 0.4) {
          flash = (1 - diff / 0.4);
        }

        // Draw glowing circles
        const alpha = Math.max(0.1, blip.opacity * 0.4 + flash * 0.6);
        ctx.fillStyle = colorPrimary.replace("0.85", String(alpha));
        ctx.shadowBlur = flash * 8;
        ctx.shadowColor = colorPrimary;
        ctx.beginPath();
        ctx.arc(blipX, blipY, blip.size + (flash * 2), 0, Math.PI * 2);
        ctx.fill();

        // Label details near blips for sci-fi look
        if (flash > 0.5 && threatLevel === "CRITICAL" || (flash > 0.6 && index === 0)) {
          ctx.shadowBlur = 0;
          ctx.fillStyle = colorPrimary.replace("0.85", "0.7");
          ctx.font = "8px monospace";
          ctx.fillText(`ANOM_0${index + 1}: ${(blip.r * 100).toFixed(0)}m`, blipX + 8, blipY - 2);
        }
      });

      // Draw center core anchor
      ctx.shadowBlur = 6;
      ctx.shadowColor = colorPrimary;
      ctx.fillStyle = colorPrimary;
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      // Update angle
      const speed = nightmareActive ? 0.045 : 0.025;
      angle = (angle + speed) % (Math.PI * 2);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [threatLevel, nightmareActive]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full block" 
      id="threat-radar-canvas"
    />
  );
}
