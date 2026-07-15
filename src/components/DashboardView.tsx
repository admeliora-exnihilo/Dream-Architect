import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { 
  ShieldAlert, 
  Brain, 
  Activity, 
  Zap, 
  RefreshCw, 
  Radio, 
  Clock, 
  User, 
  CheckCircle,
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import { ActiveProtocol, MemorySubject, EmotionalLandscape } from "../types";
import NeuralSignalWave from "./NeuralSignalWave";
import RadarChart from "./RadarChart";
import ThreatRadar from "./ThreatRadar";

interface DashboardViewProps {
  protocols: ActiveProtocol[];
  setProtocols: Dispatch<SetStateAction<ActiveProtocol[]>>;
  subjects: MemorySubject[];
  setSubjects: Dispatch<SetStateAction<MemorySubject[]>>;
  emotions: EmotionalLandscape;
  setEmotions: (emotions: EmotionalLandscape) => void;
  stability: number;
  setStability: (stability: number) => void;
  quality: number;
  setQuality: (quality: number) => void;
  systemStatus: "OPTIMAL" | "STABLE" | "ERRATIC" | "CRITICAL";
  setSystemStatus: (status: "OPTIMAL" | "STABLE" | "ERRATIC" | "CRITICAL") => void;
}

export default function DashboardView({
  protocols,
  setProtocols,
  subjects,
  setSubjects,
  emotions,
  setEmotions,
  stability,
  setStability,
  quality,
  setQuality,
  systemStatus,
  setSystemStatus,
}: DashboardViewProps) {
  // Local active states
  const [selectedLobe, setSelectedLobe] = useState<string>("OCCIPITAL (VISUAL SYNTHESIS)");
  const [time, setTime] = useState<string>("23:47:12");
  const [date, setDate] = useState<string>("02 JUL 2042");
  const [frequency, setFrequency] = useState<number>(8.6);
  const [amplitude, setAmplitude] = useState<number>(72);
  const [clarity, setClarity] = useState<"HIGH" | "STABLE" | "ERRATIC" | "CRITICAL">("HIGH");
  
  // Interactive logs array
  const [logs, setLogs] = useState<string[]>([
    "NOX OS v4.12 loaded successfully.",
    "Dream stabilization protocol established.",
    "Subject A-17 neural coupling ratio: 98.4%",
    "Monitoring alpha & theta sleep harmonics..."
  ]);

  // Handle ticking futuristic clock
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      // Format 2042 futuristic time
      const hrs = String(now.getHours()).padStart(2, "0");
      const mins = String(now.getMinutes()).padStart(2, "0");
      const secs = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hrs}:${mins}:${secs}`);
      
      // Keep date constant as requested by design 02 JUL 2042
      setDate("02 JUL 2042");
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update telemetry when active protocols or emotions change
  useEffect(() => {
    const isStabilizerActive = protocols.find(p => p.id === "stabilization")?.status === "ACTIVE";
    const isReconstructActive = protocols.find(p => p.id === "reconstruction")?.status === "ACTIVE";
    const isShieldActive = protocols.find(p => p.id === "shield")?.status === "ACTIVE";
    const isNightmareActive = protocols.find(p => p.id === "nightmare")?.status === "ACTIVE";

    // Re-calculate dashboard metrics based on protocol configuration
    let nextStability = 87;
    let nextQuality = 73;
    let nextFreq = 8.6;
    let nextAmp = 72;
    let nextClarity: "HIGH" | "STABLE" | "ERRATIC" | "CRITICAL" = "HIGH";
    let nextStatus: "OPTIMAL" | "STABLE" | "ERRATIC" | "CRITICAL" = "STABLE";

    if (!isStabilizerActive) {
      nextStability -= 35;
      nextQuality -= 25;
      nextFreq -= 2.4;
      nextAmp += 18;
      nextClarity = "ERRATIC";
    }

    if (!isNightmareActive) {
      nextStability -= 20;
      nextQuality -= 15;
      nextFreq += 4.5;
      nextAmp += 20;
      nextClarity = "CRITICAL";
    }

    if (isShieldActive) {
      nextStability += 8;
      nextQuality += 5;
      nextFreq = Math.max(4, nextFreq - 0.8);
      nextAmp = Math.max(30, nextAmp - 10);
    }

    // Limit outputs
    nextStability = Math.max(10, Math.min(100, nextStability));
    nextQuality = Math.max(10, Math.min(100, nextQuality));
    setStability(nextStability);
    setQuality(nextQuality);
    setFrequency(parseFloat(nextFreq.toFixed(1)));
    setAmplitude(nextAmp);

    // Set overall clarity & system status
    if (nextStability > 85 && isNightmareActive) {
      nextClarity = "HIGH";
      nextStatus = "OPTIMAL";
    } else if (nextStability > 60) {
      nextClarity = "STABLE";
      nextStatus = "STABLE";
    } else if (nextStability > 40) {
      nextClarity = "ERRATIC";
      nextStatus = "ERRATIC";
    } else {
      nextClarity = "CRITICAL";
      nextStatus = "CRITICAL";
    }

    setClarity(nextClarity);
    setSystemStatus(nextStatus);

  }, [protocols, setStability, setQuality, setSystemStatus]);

  // Animate memory progress bars slowly
  useEffect(() => {
    const isReconstructActive = protocols.find(p => p.id === "reconstruction")?.status === "ACTIVE";
    if (!isReconstructActive) return;

    const interval = setInterval(() => {
      setSubjects(prev => prev.map(sub => {
        if (sub.progress >= 100) return { ...sub, progress: 100, status: "COMPLETED", eta: "00:00:00" };
        
        let rate = 0.06;
        let factor = 30.0;
        if (sub.id === "a17") {
          rate = 0.05;
          factor = 11.2;
        } else if (sub.id === "b09") {
          rate = 0.08;
          factor = 52.5;
        } else if (sub.id === "c11") {
          rate = 0.07;
          factor = 24.5;
        }
        
        const nextProg = sub.progress + rate;
        
        // Calculate dynamic ETA based on remaining progress
        const remainingProg = 100 - nextProg;
        const totalSecondsLeft = Math.floor(remainingProg * factor);
        const hours = String(Math.floor(totalSecondsLeft / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((totalSecondsLeft % 3600) / 60)).padStart(2, "0");
        const seconds = String(totalSecondsLeft % 60).padStart(2, "0");
        const nextEta = `${hours}:${minutes}:${seconds}`;

        return {
          ...sub,
          progress: parseFloat(nextProg.toFixed(1)),
          eta: nextEta
        };
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, [protocols, setSubjects]);

  const addLog = (message: string) => {
    const timestamp = new Date().toTimeString().split(" ")[0];
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 5)]);
  };

  // Toggle protocol handler
  const handleToggleProtocol = (id: string) => {
    setProtocols(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === "ACTIVE" ? "STANDBY" : "ACTIVE";
        addLog(`Protocol ${p.name.toUpperCase()} switched to ${nextStatus}.`);
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  // Interactive brain lobe clicks
  const handleLobeClick = (lobeName: string, desc: string, freqMod: number) => {
    setSelectedLobe(`${lobeName.toUpperCase()} (${desc.toUpperCase()})`);
    addLog(`Focusing neural signal scanner on ${lobeName}.`);
    
    // Dynamically adjust frequency slightly on clicking
    setFrequency(prev => {
      const base = 8.6 + freqMod;
      return parseFloat((base + (Math.random() - 0.5) * 0.8).toFixed(1));
    });
  };

  // Boost Subject Repair progress directly
  const boostSubjectRepair = (id: string) => {
    setSubjects(prev => prev.map(s => {
      if (s.id === id && s.progress < 100) {
        const increment = Math.floor(8 + Math.random() * 8);
        const nextProg = Math.min(100, s.progress + increment);
        addLog(`Injected synaptic booster into Subject ${s.id.toUpperCase()}. Progress +${increment}%.`);
        return {
          ...s,
          progress: nextProg,
          status: nextProg >= 100 ? "COMPLETED" : "REPAIRING"
        };
      }
      return s;
    }));
  };

  // Get current status color helper
  const getClarityColor = (c: string) => {
    switch (c) {
      case "HIGH": return "text-cyan-400";
      case "STABLE": return "text-emerald-400";
      case "ERRATIC": return "text-amber-400 animate-pulse";
      case "CRITICAL": return "text-rose-500 font-bold animate-ping";
      default: return "text-cyan-400";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto select-none" id="dashboard-view-wrapper">
      
      {/* HEADER HUD BAR */}
      <header className="flex flex-wrap items-center justify-between gap-4 glass-panel px-6 py-4 rounded-xl border border-purple-500/10" id="hud-header">
        <div className="flex items-center gap-4" id="hud-header-mission">
          <div className="relative flex items-center justify-center" id="mission-active-indicator">
            <span className="absolute inline-flex h-3 w-3 rounded-full bg-cyan-400 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500"></span>
          </div>
          <div id="hud-mission-text">
            <span className="text-[10px] font-mono text-cyan-400/60 tracking-widest block leading-none">[ MISSION ACTIVE ]</span>
            <span className="text-xs font-display font-medium tracking-widest text-cyan-200">DREAM ARCHITECT PROTOCOL</span>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="flex flex-wrap items-center gap-2 md:gap-6 text-xs font-mono" id="hud-metrics-row">
          
          {/* SUBJECT A-17 */}
          <div className="border border-purple-500/20 bg-purple-950/20 px-4 py-2 rounded-lg flex flex-col justify-center min-w-[110px]" id="hud-subject-box">
            <span className="text-[9px] text-purple-400/50 uppercase tracking-wider">SUBJECT</span>
            <span className="font-sans font-semibold text-neon-purple tracking-widest">A-17</span>
          </div>

          {/* COCKPIT STATUS */}
          <div className="border border-purple-500/20 bg-purple-950/20 px-4 py-2 rounded-lg flex flex-col justify-center min-w-[110px]" id="hud-status-box">
            <span className="text-[9px] text-purple-400/50 uppercase tracking-wider">STATUS</span>
            <span className={`font-sans font-semibold tracking-widest uppercase ${
              systemStatus === "OPTIMAL" || systemStatus === "STABLE" ? "text-cyan-400" : "text-rose-500"
            }`}>{systemStatus}</span>
          </div>

          {/* TIMER COCKPIT */}
          <div className="border border-purple-500/20 bg-purple-950/20 px-4 py-2 rounded-lg flex flex-col justify-center min-w-[150px]" id="hud-timer-box">
            <span className="text-[9px] text-purple-400/50 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" /> SYSTEM TIME
            </span>
            <div className="flex items-baseline gap-1.5" id="hud-time-container">
              <span className="font-mono text-cyan-300 font-bold tracking-widest text-sm">{time}</span>
              <span className="text-[9px] text-purple-400/70">{date}</span>
            </div>
          </div>

          {/* OPERATOR ARCHITECT */}
          <div className="border border-purple-500/20 bg-purple-950/20 px-4 py-2 rounded-lg flex flex-col justify-center min-w-[110px]" id="hud-architect-box">
            <span className="text-[9px] text-purple-400/50 uppercase tracking-wider">ARCHITECT</span>
            <span className="font-sans font-semibold text-neon-purple tracking-widest">NOX-7</span>
          </div>

        </div>
      </header>

      {/* CORE INSTRUMENTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-cockpit-grid">
        
        {/* LEFT PANEL: STABILITY & QUALITY GAUGES (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6" id="left-gauges-container">
          
          {/* DREAM STABILITY */}
          <section className="glass-panel p-6 rounded-xl relative overflow-hidden flex flex-col justify-between min-h-[260px]" id="stability-instrument">
            <div className="flex items-start justify-between" id="stability-header">
              <div>
                <h3 className="font-display font-medium text-xs tracking-widest text-purple-300">DREAM STABILITY</h3>
                <p className="text-[10px] font-mono text-purple-400/50 mt-0.5">SYNAPTIC COUPLING INDEX</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/20 border border-emerald-500/20 px-2 py-0.5 rounded">
                ▲ 8.3% <span className="text-[9px] text-emerald-500/60">24H</span>
              </span>
            </div>

            {/* Circular Gauge Center */}
            <div className="my-3 flex justify-center items-center relative h-36" id="stability-gauge-area">
              <svg width="150" height="150" className="rotate-[-90deg]">
                {/* Background Track */}
                <circle
                  cx="75"
                  cy="75"
                  r="56"
                  fill="transparent"
                  stroke="rgba(168, 85, 247, 0.08)"
                  strokeWidth="8"
                />
                {/* Colored Progress Ring */}
                <circle
                  cx="75"
                  cy="75"
                  r="56"
                  fill="transparent"
                  stroke={stability < 50 ? "#f43f5e" : "#06b6d4"}
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 56}
                  strokeDashoffset={2 * Math.PI * 56 * (1 - stability / 100)}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              {/* Inner Text Values */}
              <div className="absolute text-center select-none" id="stability-value-text">
                <span className="block font-display text-3xl font-extrabold text-neon-cyan leading-none">{stability}%</span>
                <span className="text-[10px] font-mono text-purple-400 tracking-wider">STABILITY</span>
              </div>
            </div>

            {/* Mini trend line graph */}
            <div className="border-t border-purple-500/10 pt-3" id="stability-trendline-box">
              <div className="flex items-center justify-between text-[9px] font-mono text-purple-400/60 mb-1">
                <span>TREND (24H)</span>
                <span>00.00 - 24.00</span>
              </div>
              {/* Mock SVG trendline */}
              <svg viewBox="0 0 300 30" className="w-full h-8 overflow-visible">
                <path
                  d="M 0,25 Q 30,15 60,18 T 120,20 T 180,10 T 240,15 T 300,5"
                  fill="none"
                  stroke="rgba(6, 182, 212, 0.45)"
                  strokeWidth="1.5"
                  id="stability-trend-path"
                />
                <path
                  d="M 0,25 Q 30,15 60,18 T 120,20 T 180,10 T 240,15 T 300,5 L 300,30 L 0,30 Z"
                  fill="url(#stability-trend-gradient)"
                  id="stability-trend-shadow"
                />
                <defs>
                  <linearGradient id="stability-trend-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(6, 182, 212, 0.15)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </section>

          {/* DREAM QUALITY */}
          <section className="glass-panel p-6 rounded-xl flex flex-col justify-between min-h-[260px]" id="quality-instrument">
            <div className="flex items-start justify-between" id="quality-header">
              <div>
                <h3 className="font-display font-medium text-xs tracking-widest text-purple-300">DREAM QUALITY</h3>
                <p className="text-[10px] font-mono text-purple-400/50 mt-0.5">WEEKLY CONSOLIDATION RATIO</p>
              </div>
              <span className="text-xs font-mono text-purple-400 flex items-center gap-1 bg-purple-950/20 border border-purple-500/20 px-2 py-0.5 rounded">
                ▲ 5.7% <span className="text-[9px] text-purple-500/60">AVG</span>
              </span>
            </div>

            {/* Quality chart layouts */}
            <div className="grid grid-cols-2 gap-4 items-center my-2" id="quality-analytics-grid">
              {/* Left Column: Mock Bar Chart */}
              <div className="flex items-end justify-between h-24 px-1" id="weekly-overview-bars">
                {[45, 58, 62, 75, 48, 80, quality].map((val, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 w-2" id={`quality-bar-col-${i}`}>
                    <div 
                      className="w-full bg-purple-500/40 rounded-t-sm relative transition-all duration-1000 ease-out" 
                      style={{ height: `${(val / 100) * 75}px` }}
                      id={`quality-bar-${i}`}
                    >
                      {i === 6 && (
                        <div className="absolute inset-0 bg-purple-400 animate-pulse rounded-t-sm" />
                      )}
                    </div>
                    <span className="text-[8px] font-mono text-purple-400/55">
                      {["M", "T", "W", "T", "F", "S", "S"][i]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Right Column: Circular Quality dial */}
              <div className="relative flex justify-center items-center" id="quality-dial-wrapper">
                <svg width="100" height="100" className="rotate-[135deg]">
                  {/* Gauge Arc Background */}
                  <circle
                    cx="50"
                    cy="50"
                    r="34"
                    fill="transparent"
                    stroke="rgba(168, 85, 247, 0.08)"
                    strokeWidth="6"
                    strokeDasharray={`${2 * Math.PI * 34 * 0.75} ${2 * Math.PI * 34 * 0.25}`}
                  />
                  {/* Gauge Progress Arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="34"
                    fill="transparent"
                    stroke="#a855f7"
                    strokeWidth="6"
                    strokeDasharray={`${2 * Math.PI * 34 * 0.75} ${2 * Math.PI * 34 * 0.25}`}
                    strokeDashoffset={2 * Math.PI * 34 * 0.75 * (1 - quality / 100)}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                {/* Text overlay */}
                <div className="absolute text-center select-none" id="quality-dial-text">
                  <span className="block font-mono text-lg font-bold text-neon-purple leading-none">{quality}%</span>
                  <span className="text-[8px] font-mono text-purple-400/60 uppercase">QUALITY</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] font-mono text-purple-400/50 leading-relaxed border-t border-purple-500/10 pt-3" id="quality-footer-text">
              Weekly overview metrics confirm that dream rendering coherence is steady, with REM phase duration in optimal bounds.
            </p>
          </section>

        </div>

        {/* CENTER PANEL: NEURAL SCANNER COCKPIT (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6" id="center-cockpit-container">
          
          {/* NEURAL SCANNER CARD */}
          <section className="glass-panel p-6 rounded-xl flex flex-col justify-between flex-1 min-h-[380px]" id="neural-scanner-instrument">
            <div id="neural-scanner-header">
              <h3 className="font-display font-medium text-xs tracking-widest text-purple-300">NEURAL SCANNER</h3>
              <p className="text-[10px] font-mono text-cyan-400/60 mt-0.5">REAL TIME DREAM INTERFACE</p>
            </div>

            {/* Clickable Vector SVG Brain */}
            <div className="my-4 flex flex-col items-center justify-center relative" id="neural-brain-scanner-area">
              <div className="text-[8px] font-mono text-purple-400/40 absolute top-0 tracking-widest" id="brain-header-tag">
                [ CLICK LOBE TO ISOLATE SIGNAL ]
              </div>

              <svg viewBox="0 0 240 180" className="w-72 h-auto drop-shadow-[0_0_20px_rgba(168,85,247,0.2)]" id="brain-lobes-svg">
                {/* FRONTAL LOBE (Cognition / Choice) */}
                <path
                  d="M 30,85 C 30,40 65,30 115,30 C 115,30 115,60 110,85 C 105,110 85,125 70,125 C 45,125 30,110 30,85 Z"
                  fill={selectedLobe.startsWith("FRONTAL") ? "rgba(6, 182, 212, 0.35)" : "rgba(168, 85, 247, 0.12)"}
                  stroke={selectedLobe.startsWith("FRONTAL") ? "rgba(6, 182, 212, 0.85)" : "rgba(168, 85, 247, 0.4)"}
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all duration-300 hover:fill-cyan-500/25"
                  onClick={() => handleLobeClick("Frontal Lobe", "Active Dream Control", 1.8)}
                  id="brain-lobe-frontal"
                />

                {/* PARIETAL LOBE (Sensation / Orientation) */}
                <path
                  d="M 115,30 C 145,30 185,35 195,75 C 195,75 160,75 140,80 C 120,85 115,30 115,30 Z"
                  fill={selectedLobe.startsWith("PARIETAL") ? "rgba(6, 182, 212, 0.35)" : "rgba(168, 85, 247, 0.12)"}
                  stroke={selectedLobe.startsWith("PARIETAL") ? "rgba(6, 182, 212, 0.85)" : "rgba(168, 85, 247, 0.4)"}
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all duration-300 hover:fill-cyan-500/25"
                  onClick={() => handleLobeClick("Parietal Lobe", "Somatic Feedback", -0.5)}
                  id="brain-lobe-parietal"
                />

                {/* OCCIPITAL LOBE (Visual Synthesis) */}
                <path
                  d="M 195,75 C 210,90 215,110 195,125 C 175,140 160,125 150,115 C 140,105 160,75 195,75 Z"
                  fill={selectedLobe.startsWith("OCCIPITAL") ? "rgba(6, 182, 212, 0.35)" : "rgba(168, 85, 247, 0.12)"}
                  stroke={selectedLobe.startsWith("OCCIPITAL") ? "rgba(6, 182, 212, 0.85)" : "rgba(168, 85, 247, 0.4)"}
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all duration-300 hover:fill-cyan-500/25"
                  onClick={() => handleLobeClick("Occipital Lobe", "Visual Synthesis", 0.0)}
                  id="brain-lobe-occipital"
                />

                {/* TEMPORAL LOBE (Memory / Sound) */}
                <path
                  d="M 110,85 C 125,85 145,95 150,115 C 145,130 115,145 90,145 C 75,145 105,110 110,85 Z"
                  fill={selectedLobe.startsWith("TEMPORAL") ? "rgba(6, 182, 212, 0.35)" : "rgba(168, 85, 247, 0.12)"}
                  stroke={selectedLobe.startsWith("TEMPORAL") ? "rgba(6, 182, 212, 0.85)" : "rgba(168, 85, 247, 0.4)"}
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all duration-300 hover:fill-cyan-500/25"
                  onClick={() => handleLobeClick("Temporal Lobe", "Memory Archiving", -1.4)}
                  id="brain-lobe-temporal"
                />

                {/* CEREBELLUM (Coordination / Physical anchor) */}
                <path
                  d="M 150,125 C 165,125 185,135 175,150 C 165,160 145,160 135,150 C 125,140 135,125 150,125 Z"
                  fill={selectedLobe.startsWith("CEREBELLUM") ? "rgba(6, 182, 212, 0.35)" : "rgba(168, 85, 247, 0.08)"}
                  stroke={selectedLobe.startsWith("CEREBELLUM") ? "rgba(6, 182, 212, 0.85)" : "rgba(168, 85, 247, 0.3)"}
                  strokeWidth="1"
                  className="cursor-pointer transition-all duration-300 hover:fill-cyan-500/25"
                  onClick={() => handleLobeClick("Cerebellum", "Physical Grounding", -2.1)}
                  id="brain-lobe-cerebellum"
                />

                {/* Floating particle connectors in brain */}
                <g className="animate-pulse" id="brain-pulsing-synapses">
                  <circle cx="80" cy="70" r="3" fill="#06b6d4" />
                  <line x1="80" y1="70" x2="110" y2="55" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1" />
                  <circle cx="110" cy="55" r="2.5" fill="#a855f7" />
                  <circle cx="150" cy="65" r="3" fill="#06b6d4" />
                  <line x1="150" y1="65" x2="175" y2="100" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1" />
                  <circle cx="175" cy="100" r="2.5" fill="#a855f7" />
                </g>
              </svg>

              {/* Display selected Lobe name */}
              <div className="mt-2 text-center" id="brain-selected-display">
                <span className="text-[10px] font-mono text-purple-400/60 uppercase">ACTIVE FIELD ANALYSIS:</span>
                <span className="block text-xs font-display text-cyan-300 font-semibold tracking-wider glow-pulse">
                  {selectedLobe}
                </span>
              </div>
            </div>

            {/* NEURAL SIGNAL BOX (WAVE) */}
            <div className="border border-purple-500/10 bg-purple-950/20 p-4 rounded-xl flex flex-col gap-2 relative overflow-hidden" id="neural-signal-panel">
              <div className="flex items-center justify-between text-[10px] font-mono" id="neural-signal-header">
                <span className="text-purple-300 tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-cyan-400" /> NEURAL SIGNAL
                </span>
                <span className="text-cyan-400 font-semibold tracking-widest animate-pulse">LIVE</span>
              </div>

              {/* Animated oscilloscope wave */}
              <div className="h-16 w-full my-1" id="neural-wave-canvas-wrapper">
                <NeuralSignalWave 
                  frequency={frequency} 
                  amplitude={amplitude} 
                  clarity={clarity} 
                />
              </div>

              {/* Metrics beneath wave */}
              <div className="grid grid-cols-3 gap-2 text-center border-t border-purple-500/10 pt-3 text-xs" id="neural-signal-footer">
                <div id="metric-frequency">
                  <span className="block text-[8px] font-mono text-purple-400/50 uppercase">FREQUENCY</span>
                  <span className="font-mono font-bold text-cyan-300">{frequency} Hz</span>
                </div>
                <div id="metric-amplitude">
                  <span className="block text-[8px] font-mono text-purple-400/50 uppercase">AMPLITUDE</span>
                  <span className="font-mono font-bold text-purple-300">{amplitude}%</span>
                </div>
                <div id="metric-clarity">
                  <span className="block text-[8px] font-mono text-purple-400/50 uppercase">CLARITY</span>
                  <span className={`font-mono font-bold uppercase ${getClarityColor(clarity)}`}>
                    {clarity}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT PANEL: THREATS & PROTOCOLS (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6" id="right-protocols-container">
          
          {/* THREAT DETECTION */}
          <section className="glass-panel p-5 rounded-xl flex flex-col justify-between min-h-[220px]" id="threat-instrument">
            <div className="flex items-start justify-between" id="threat-header">
              <div>
                <h3 className="font-display font-medium text-xs tracking-widest text-rose-300">THREAT DETECTION</h3>
                <p className="text-[10px] font-mono text-rose-500/60 mt-0.5">NIGHTMARE SUPPRESSOR INTELLIGENCE</p>
              </div>
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                systemStatus === "CRITICAL" || systemStatus === "ERRATIC"
                  ? "text-rose-400 bg-rose-950/20 border-rose-500/20 animate-pulse font-bold"
                  : "text-emerald-400 bg-emerald-950/20 border-emerald-500/20"
              }`} id="threat-badge">
                {systemStatus === "CRITICAL" || systemStatus === "ERRATIC" ? "HIGH" : "LOW"}
              </span>
            </div>

            {/* Sonar Radar Canvas Area */}
            <div className="flex gap-4 items-center my-3" id="threat-radar-details">
              <div className="w-24 h-24 shrink-0" id="threat-radar-box">
                <ThreatRadar 
                  threatLevel={systemStatus === "CRITICAL" || systemStatus === "ERRATIC" ? "HIGH" : "LOW"} 
                  nightmareActive={protocols.find(p => p.id === "nightmare")?.status === "ACTIVE"}
                />
              </div>

              {/* Sub Threat indicators */}
              <div className="flex-1 space-y-1.5 font-mono text-[9px] uppercase tracking-wider text-purple-400/70" id="threat-metrics-list">
                <div className="flex justify-between items-center" id="threat-row-nightmare">
                  <span>NIGHTMARE ACTIVITY:</span>
                  <span className={protocols.find(p => p.id === "nightmare")?.status === "ACTIVE" ? "text-emerald-400" : "text-rose-500 font-semibold"}>
                    {protocols.find(p => p.id === "nightmare")?.status === "ACTIVE" ? "LOW" : "HIGH"}
                  </span>
                </div>
                <div className="flex justify-between items-center" id="threat-row-corruption">
                  <span>MEMORY CORRUPTION:</span>
                  <span className="text-amber-400 font-semibold">MEDIUM</span>
                </div>
                <div className="flex justify-between items-center" id="threat-row-instability">
                  <span>EMOTIONAL SPURS:</span>
                  <span className={stability < 60 ? "text-rose-400 animate-pulse font-semibold" : "text-emerald-400"}>
                    {stability < 60 ? "HIGH" : "LOW"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* EMOTIONAL LANDSPACE */}
          <section className="glass-panel p-5 rounded-xl flex flex-col justify-between min-h-[240px]" id="emotion-instrument">
            <div id="emotion-instrument-header">
              <h3 className="font-display font-medium text-xs tracking-widest text-purple-300">EMOTIONAL LANDSCAPE</h3>
              <p className="text-[10px] font-mono text-purple-400/50 mt-0.5">SUB-CONSCIOUS WAVEFORM NODES</p>
            </div>

            {/* Mini SVG Radar Polygon Chart */}
            <div className="h-36 my-2" id="emotion-radar-chart-area">
              <RadarChart 
                fear={emotions.fear} 
                joy={emotions.joy} 
                trust={emotions.trust} 
                sadness={emotions.sadness} 
                anger={emotions.anger} 
              />
            </div>

            <div className="flex justify-between items-center border-t border-purple-500/10 pt-3 text-[10px] font-mono" id="emotion-instrument-footer">
              <span className="text-purple-400/60 uppercase">EMOTIONAL BALANCE:</span>
              <span className="text-purple-300 font-bold uppercase">
                {emotions.joy > 70 ? "STABLE FLOW" : emotions.fear > 60 ? "HIGH STRESS" : "MODERATE"}
              </span>
            </div>
          </section>

        </div>

      </div>

      {/* BOTTOM SECTION: MEMORY REPAIR QUEUE & PROTOCOL SWITCHES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-bottom-row">
        
        {/* MEMORY REPAIR QUEUE (8 cols) */}
        <div className="lg:col-span-8 flex flex-col" id="memory-queue-glow-container-col">
          <section className="glass-panel p-6 flex flex-col justify-between flex-1" id="memory-queue-panel">
            <div className="flex items-center justify-between border-b border-purple-500/15 pb-4 mb-4" id="memory-queue-header">
              <div>
                <h3 className="font-display font-medium text-xs tracking-widest text-purple-300 uppercase">MEMORY REPAIR QUEUE</h3>
                <p className="text-[10px] font-mono text-purple-400/50 mt-0.5">TRAUMA SECTOR DEFRAGMENTATION STATUS</p>
              </div>
                <span className="text-[9px] font-mono text-purple-400 bg-purple-950/40 border border-purple-500/20 px-2 py-0.5 rounded tracking-widest" id="memory-queue-sub-badge">
                  ALPHA-SECURE NODE
                </span>
              </div>

              <div className="space-y-5" id="memory-queue-subjects-list">
                {subjects.map((sub) => (
                  <div key={sub.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3.5 rounded-lg border border-purple-500/10 bg-purple-950/10 hover:border-purple-500/25 transition-all duration-300" id={`memory-subject-row-${sub.id}`}>
                    
                    {/* Info and issue */}
                    <div className="flex items-start gap-3.5" id={`subject-info-box-${sub.id}`}>
                      <div className="p-2.5 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-400" id={`subject-icon-box-${sub.id}`}>
                        <User className="w-5 h-5 text-purple-300" id={`subject-icon-${sub.id}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2" id={`subject-meta-${sub.id}`}>
                          <span className="font-sans font-bold text-neon-purple text-sm">{sub.name}</span>
                          <span className={`text-[8px] font-mono px-2 py-0.5 rounded ${
                            sub.status === "COMPLETED" ? "text-emerald-400 bg-emerald-950/20 border border-emerald-500/20" : "text-cyan-400 bg-cyan-950/20 border border-cyan-500/20"
                          }`} id={`subject-status-badge-${sub.id}`}>
                            {sub.status}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-purple-300/60 mt-0.5">{sub.issue}</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="flex-1 max-w-sm flex flex-col gap-1.5" id={`subject-progress-container-${sub.id}`}>
                      <div className="flex justify-between text-[10px] font-mono" id={`subject-progress-stats-${sub.id}`}>
                        <span className="text-purple-400/60">SYNAPTIC FIX RATIO</span>
                        <span className="text-cyan-300 font-bold">{sub.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-purple-950/50 rounded-full overflow-hidden border border-purple-500/10" id={`subject-progress-bar-track-${sub.id}`}>
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            sub.progress >= 100 
                              ? "bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" 
                              : "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                          }`}
                          style={{ width: `${sub.progress}%` }}
                          id={`subject-progress-bar-fill-${sub.id}`}
                        />
                      </div>
                    </div>

                    {/* ETA countdown and boost action */}
                    <div className="flex items-center justify-between md:justify-end gap-6 min-w-[170px]" id={`subject-actions-box-${sub.id}`}>
                      <div className="text-left md:text-right" id={`subject-eta-box-${sub.id}`}>
                        <span className="block text-[8px] font-mono text-purple-400/50">ETA COMP</span>
                        <span className="font-mono text-xs text-purple-300 font-semibold">{sub.eta}</span>
                      </div>

                      <button
                        disabled={sub.progress >= 100}
                        onClick={() => boostSubjectRepair(sub.id)}
                        className={`px-3 py-2 rounded-lg font-display text-[10px] tracking-widest flex items-center gap-1.5 border transition-all duration-300 ${
                          sub.progress >= 100
                            ? "text-slate-500/40 border-slate-500/5 bg-transparent cursor-not-allowed"
                            : "glass-button text-cyan-300 hover:text-cyan-200 border-cyan-500/30"
                        }`}
                        id={`subject-boost-btn-${sub.id}`}
                      >
                        <Zap className="w-3 h-3" /> BOOST
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </section>
        </div>

        {/* ACTIVE PROTOCOLS CONTROL SWITCHES (4 cols) */}
        <section className="lg:col-span-4 glass-panel p-6 rounded-xl flex flex-col justify-between" id="protocols-control-panel">
          <div className="border-b border-slate-500/15 pb-4 mb-4" id="protocols-control-header">
            <h3 className="font-display font-medium text-xs tracking-widest text-slate-300 uppercase">ACTIVE PROTOCOLS</h3>
            <p className="text-[10px] font-mono text-slate-400/50 mt-0.5">COCKPIT CRITICAL INTERLOCK SWITCHES</p>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-center" id="protocols-list-switches">
            {protocols.map((proto) => (
              <div 
                key={proto.id} 
                onClick={() => handleToggleProtocol(proto.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer select-none transition-all duration-300 ${
                  proto.status === "ACTIVE"
                    ? "bg-slate-950/20 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.05)] text-neon-cyan"
                    : "bg-slate-950/5 border-slate-500/10 text-slate-400/60 hover:border-slate-500/20"
                }`}
                id={`protocol-switch-row-${proto.id}`}
              >
                <div className="flex flex-col" id={`protocol-switch-label-${proto.id}`}>
                  <span className="font-display text-xs tracking-wider font-semibold uppercase">{proto.name}</span>
                  <span className="text-[8px] font-mono text-slate-400/50 uppercase mt-0.5">{proto.description}</span>
                </div>
                
                {/* On/Off light status */}
                <div className="flex items-center gap-2.5" id={`protocol-switch-light-${proto.id}`}>
                  <span className="text-[9px] font-mono tracking-widest uppercase">
                    {proto.status}
                  </span>
                  <div className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${
                    proto.status === "ACTIVE"
                      ? "bg-cyan-400 border-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                      : "bg-slate-950 border-slate-500/25"
                  }`} id={`protocol-switch-glow-${proto.id}`} />
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* COCKPIT LIVE LOGS STREAM */}
      <section className="glass-panel p-4 rounded-xl font-mono text-[10px] text-slate-400/70 border border-slate-500/10" id="cockpit-logs-terminal">
        <div className="flex items-center justify-between border-b border-slate-500/10 pb-2 mb-2" id="logs-terminal-header">
          <span className="text-[9px] tracking-widest font-semibold text-slate-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> COCKPIT EVENT ARCHIVE LOG
          </span>
          <span>NOX_OS // T-17</span>
        </div>
        <div className="space-y-1.5 max-h-24 overflow-y-auto select-text font-mono" id="logs-terminal-output">
          {logs.map((log, i) => (
            <div key={i} className="text-cyan-400/80 leading-relaxed" id={`terminal-log-${i}`}>
              &gt; {log}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
