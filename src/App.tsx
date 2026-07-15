import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageType, ActiveProtocol, MemorySubject, EmotionalLandscape, BuiltDream, CustomDreamNode } from "./types";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import DreamMapView from "./components/DreamMapView";
import MemoryVaultView from "./components/MemoryVaultView";
import EmotionCenterView from "./components/EmotionCenterView";
import DreamBuilderView from "./components/DreamBuilderView";

export default function App() {
  const [activePage, setActivePage] = useState<PageType>("dashboard");
  const [systemStatus, setSystemStatus] = useState<"OPTIMAL" | "STABLE" | "ERRATIC" | "CRITICAL">("STABLE");
  
  // SHARED GLOBAL STATES
  const [stability, setStability] = useState<number>(87);
  const [quality, setQuality] = useState<number>(73);
  const [emotions, setEmotions] = useState<EmotionalLandscape>({
    fear: 72,
    joy: 48,
    trust: 65,
    sadness: 38,
    anger: 55,
  });

  const [protocols, setProtocols] = useState<ActiveProtocol[]>([
    { 
      id: "stabilization", 
      name: "Dream Stabilization", 
      status: "ACTIVE", 
      description: "Alpha & theta sleepwave lock" 
    },
    { 
      id: "reconstruction", 
      name: "Memory Reconstruction", 
      status: "ACTIVE", 
      description: "Synaptic bridge defragmenter" 
    },
    { 
      id: "shield", 
      name: "Neural Shield", 
      status: "STANDBY", 
      description: "Sub-conscious perimeter firewall" 
    },
    { 
      id: "nightmare", 
      name: "Nightmare Suppression", 
      status: "ACTIVE", 
      description: "Amygdala feedback loop dampener" 
    },
  ]);

  const [subjects, setSubjects] = useState<MemorySubject[]>([
    { 
      id: "a17", 
      name: "SUBJECT A-17", 
      issue: "Trauma Fragment Detected", 
      progress: 65, 
      eta: "00:12:45", 
      status: "REPAIRING" 
    },
    { 
      id: "b09", 
      name: "SUBJECT B-09", 
      issue: "Memory Corruption Detected", 
      progress: 32, 
      eta: "00:28:10", 
      status: "REPAIRING" 
    },
    { 
      id: "c11", 
      name: "SUBJECT C-11", 
      issue: "Lucid Anchor Desynchronized", 
      progress: 47, 
      eta: "00:19:15", 
      status: "REPAIRING" 
    },
  ]);

  const [nodes, setNodes] = useState<CustomDreamNode[]>([
    {
      id: "drowning-city",
      label: "THE DROWNING CITY",
      type: "nightmare",
      depth: "REM-4 (Sub-Deep)",
      activity: 90,
      x: 33,
      y: 38,
      description: "A dark submerged metropolitan maze representing deeply suppressed feelings of helplessness. Frequencies are echoing erratic patterns.",
      stats: { depthVal: 43, echoVal: 84, driftVal: 31 }
    },
    {
      id: "mirror-corridor",
      label: "MIRROR CORRIDOR",
      type: "anomaly",
      depth: "REM-3 (Core Deep)",
      activity: 70,
      x: 49,
      y: 28,
      description: "Infinite mirror alignments reflecting disjointed memory shadows. Highly susceptible to sensory echoes and temporal glitches.",
      stats: { depthVal: 27, echoVal: 65, driftVal: 48 }
    },
    {
      id: "solar-flare",
      label: "SOLAR FLARE",
      type: "lucid",
      depth: "REM-5 (Hyper-Lucid)",
      activity: 85,
      x: 65,
      y: 30,
      description: "Intense energetic bursts of lucidity and extreme spatial control. Synapses firing at maximum theta frequency.",
      stats: { depthVal: 15, echoVal: 92, driftVal: 18 }
    },
    {
      id: "garden-orion",
      label: "GARDEN OF ORION",
      type: "lucid",
      depth: "REM-2 (Alpha Sleep)",
      activity: 60,
      x: 58,
      y: 44,
      description: "A peaceful botanical oasis suspended in cosmic space, providing calming theta stabilization points.",
      stats: { depthVal: 52, echoVal: 76, driftVal: 25 }
    },
    {
      id: "crimson-memory",
      label: "CRIMSON MEMORY",
      type: "nightmare",
      depth: "REM-4 (Sub-Deep)",
      activity: 75,
      x: 45,
      y: 56,
      description: "Unresolved high-stress memories colored in deep crimson hues. Requires direct therapeutic coupling and emotional defragmentation.",
      stats: { depthVal: 78, echoVal: 50, driftVal: 82 }
    },
    {
      id: "childhood-house",
      label: "CHILDHOOD HOUSE",
      type: "memory",
      depth: "REM-1 (Liminal State)",
      activity: 45,
      x: 31,
      y: 63,
      description: "Traditional high-fidelity recall of early childhood residence. Stable layout with faint sensory and acoustic echoes.",
      stats: { depthVal: 10, echoVal: 40, driftVal: 5 }
    },
    {
      id: "infinite-staircase",
      label: "INFINITE STAIRCASE",
      type: "memory",
      depth: "REM-3 (Core Deep)",
      activity: 55,
      x: 51,
      y: 66,
      description: "A staircase ascending forever into geometric fog. Serves as a safe spatial navigation liminal corridor.",
      stats: { depthVal: 88, echoVal: 60, driftVal: 90 }
    }
  ]);

  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);

  // Animated background effect drawing constellation nodes
  useEffect(() => {
    const canvas = backgroundCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Initialize stars/particles with varying depths (3D feel)
    const particleCount = 65;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      pulseSpeed: number;
      pulsePhase: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.4 + 0.15,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let lightPhase = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create base rich deep space gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, "#010306");
      bgGrad.addColorStop(0.5, "#020710");
      bgGrad.addColorStop(1, "#000103");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Volumetric Lighting (Slowly rotating/pulsating ambient spotlights)
      lightPhase += 0.002;
      
      // Spotlight 1: Slate-blue glow in the middle-left
      const spot1X = canvas.width * 0.3 + Math.cos(lightPhase) * 120;
      const spot1Y = canvas.height * 0.4 + Math.sin(lightPhase * 0.8) * 80;
      const spot1Rad = Math.min(canvas.width, canvas.height) * 0.6;
      const spot1 = ctx.createRadialGradient(spot1X, spot1Y, 0, spot1X, spot1Y, spot1Rad);
      spot1.addColorStop(0, "rgba(100, 116, 139, 0.03)");
      spot1.addColorStop(0.5, "rgba(100, 116, 139, 0.01)");
      spot1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = spot1;
      ctx.beginPath();
      ctx.arc(spot1X, spot1Y, spot1Rad, 0, Math.PI * 2);
      ctx.fill();

      // Spotlight 2: Cyan glow in the middle-right
      const spot2X = canvas.width * 0.75 + Math.sin(lightPhase * 1.2) * 140;
      const spot2Y = canvas.height * 0.55 + Math.cos(lightPhase * 0.9) * 100;
      const spot2Rad = Math.min(canvas.width, canvas.height) * 0.7;
      const spot2 = ctx.createRadialGradient(spot2X, spot2Y, 0, spot2X, spot2Y, spot2Rad);
      spot2.addColorStop(0, "rgba(6, 182, 212, 0.025)");
      spot2.addColorStop(0.5, "rgba(6, 182, 212, 0.008)");
      spot2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = spot2;
      ctx.beginPath();
      ctx.arc(spot2X, spot2Y, spot2Rad, 0, Math.PI * 2);
      ctx.fill();

      // Spotlight 3: Deep Midnight Blue glow in the bottom-center
      const spot3X = canvas.width * 0.5 + Math.cos(lightPhase * 0.7) * 200;
      const spot3Y = canvas.height * 0.9;
      const spot3Rad = Math.min(canvas.width, canvas.height) * 0.5;
      const spot3 = ctx.createRadialGradient(spot3X, spot3Y, 0, spot3X, spot3Y, spot3Rad);
      spot3.addColorStop(0, "rgba(15, 23, 42, 0.03)");
      spot3.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = spot3;
      ctx.beginPath();
      ctx.arc(spot3X, spot3Y, spot3Rad, 0, Math.PI * 2);
      ctx.fill();

      // Draw faint background grid
      ctx.strokeStyle = "rgba(6, 182, 212, 0.018)";
      ctx.lineWidth = 1;
      const gridSize = 64;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw and connect nodes
      ctx.shadowBlur = 0;
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce of edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Slow pulse rate
        p.pulsePhase += p.pulseSpeed;
        const currentAlpha = p.alpha + Math.sin(p.pulsePhase) * 0.08;

        // Draw particle node with a subtle 3D halo glow
        ctx.fillStyle = `rgba(6, 182, 212, ${Math.max(0.05, currentAlpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby nodes
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 140) {
            const lineAlpha = (1 - dist / 140) * 0.08;
            ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleDreamCompiled = (dream: BuiltDream) => {
    // Dynamically update stability and quality based on the synthesized dream protocol
    setStability(dream.stabilityRating);
    
    // Add newly compiled dream into subject lists or logs
    const newSubject: MemorySubject = {
      id: `compiled-${Math.floor(Math.random() * 900)}`,
      name: dream.protocolName,
      issue: `AI-Synthesized Protocol // Freq: ${dream.frequency}`,
      progress: 0,
      eta: "00:05:00",
      status: "REPAIRING"
    };

    setSubjects(prev => [newSubject, ...prev.slice(0, 2)]);

    // Map compiled mood to valid map node type
    const m = dream.mood || "lucid";
    const nodeType: "nightmare" | "lucid" | "anomaly" | "memory" = 
      m === "nightmare" ? "nightmare" :
      m === "peaceful" ? "memory" : "lucid";

    // Dynamic emotions modification according to mood
    if (m === "nightmare") {
      setEmotions({
        fear: Math.min(100, Math.floor(80 + Math.random() * 15)),
        joy: Math.max(0, Math.floor(10 + Math.random() * 10)),
        trust: Math.max(0, Math.floor(15 + Math.random() * 15)),
        sadness: Math.min(100, Math.floor(65 + Math.random() * 20)),
        anger: Math.min(100, Math.floor(75 + Math.random() * 15)),
      });
      setSystemStatus("ERRATIC");
    } else if (m === "peaceful") {
      setEmotions({
        fear: Math.max(0, Math.floor(10 + Math.random() * 15)),
        joy: Math.min(100, Math.floor(85 + Math.random() * 12)),
        trust: Math.min(100, Math.floor(80 + Math.random() * 15)),
        sadness: Math.max(0, Math.floor(15 + Math.random() * 15)),
        anger: Math.max(0, Math.floor(5 + Math.random() * 10)),
      });
      setSystemStatus("OPTIMAL");
    } else { // lucid
      setEmotions({
        fear: Math.max(0, Math.floor(15 + Math.random() * 15)),
        joy: Math.min(100, Math.floor(75 + Math.random() * 15)),
        trust: Math.min(100, Math.floor(90 + Math.random() * 10)),
        sadness: Math.max(0, Math.floor(20 + Math.random() * 15)),
        anger: Math.max(0, Math.floor(10 + Math.random() * 10)),
      });
      setSystemStatus("STABLE");
    }

    // Add generated dream as a node in the Dream Map
    const newMapNode: CustomDreamNode = {
      id: `node-${Date.now()}`,
      label: dream.protocolName.toUpperCase(),
      type: nodeType,
      depth: `REM-${Math.floor(Math.random() * 3 + 2)} (AI Gen)`,
      activity: Math.floor(Math.random() * 30 + 50),
      x: Math.floor(Math.random() * 45 + 28), // 28 to 73% (fits perfectly on map)
      y: Math.floor(Math.random() * 40 + 25), // 25 to 65% (fits perfectly on map)
      description: dream.narrative,
      stats: {
        depthVal: Math.floor(Math.random() * 75 + 15),
        echoVal: Math.floor(Math.random() * 75 + 15),
        driftVal: Math.floor(Math.random() * 75 + 15)
      }
    };

    setNodes(prev => [...prev, newMapNode]);
  };

  // Render Page Swapper with transitions
  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <DashboardView
            protocols={protocols}
            setProtocols={setProtocols}
            subjects={subjects}
            setSubjects={setSubjects}
            emotions={emotions}
            setEmotions={setEmotions}
            stability={stability}
            setStability={setStability}
            quality={quality}
            setQuality={setQuality}
            systemStatus={systemStatus}
            setSystemStatus={setSystemStatus}
          />
        );
      case "map":
        return <DreamMapView nodes={nodes} setNodes={setNodes} />;
      case "vault":
        return <MemoryVaultView />;
      case "emotion":
        return (
          <EmotionCenterView 
            emotions={emotions} 
            setEmotions={setEmotions} 
          />
        );
      case "builder":
        return <DreamBuilderView onDreamCompiled={handleDreamCompiled} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden text-slate-100 relative font-sans" id="dream-architect-root">
      {/* Absolute floating backdrop canvas */}
      <canvas
        ref={backgroundCanvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none z-0"
        id="app-backdrop-canvas"
      />

      {/* Cyberpunk Scanline Overlays */}
      <div className="absolute inset-0 pointer-events-none scanline opacity-35 z-10" id="scanline-overlay" />

      {/* Glassmorphic Side navigation */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        systemStatus={systemStatus}
      />

      {/* Main viewport area */}
      <main className="flex-1 overflow-y-auto px-8 py-6 z-20 relative" id="app-main-viewport">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="h-full"
            id={`route-container-${activePage}`}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
