import { useState, FormEvent } from "react";
import { Wand2, RefreshCw, Layers, ShieldAlert, CheckCircle, Terminal, HelpCircle } from "lucide-react";
import { BuiltDream } from "../types";

interface DreamBuilderViewProps {
  onDreamCompiled: (dream: BuiltDream) => void;
}

export default function DreamBuilderView({ onDreamCompiled }: DreamBuilderViewProps) {
  // Input form states
  const [theme, setTheme] = useState<string>("");
  const [setting, setSetting] = useState<string>("Shattered Astral Plain");
  const [companion, setCompanion] = useState<string>("Holographic Cyber Cat");
  const [mood, setMood] = useState<string>("lucid");

  // App compilation/loading states
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compiledDream, setCompiledDream] = useState<BuiltDream | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  // Selection list options
  const settingsList = [
    "Shattered Astral Plain",
    "Cyberpunk Megacity Tokyo",
    "Abyssal Oceanic Coral Reef",
    "Ancient Library of Alexandria",
    "Deep Space Outpost Nebula"
  ];

  const companionsList = [
    "Holographic Cyber Cat",
    "Silent Quantum Specter",
    "Synthetic Forest Sprite",
    "Ancient Celestial Sentinel",
    "Self / Alone"
  ];

  const triggerConsoleLogs = (callback: () => void) => {
    setConsoleLogs([]);
    const logs = [
      "CRITICAL: Securing high-density theta bandwidth couplers...",
      "SYSTEM: Resolving local synaptic render channels [Sector REM-4]...",
      "NETWORK: Establising gateway to Gemini Core intelligence cluster...",
      "AI_OS: Parsing cognitive prompt parameters & sub-context matrices...",
      "RENDERER: Synthesizing vivid volumetric backdrops & somatic cues...",
      "SUCCESS: Dream protocol compiling completed successfully. Syncing cockpit telemetry..."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setConsoleLogs(prev => [...prev, logs[i]]);
        i++;
      } else {
        clearInterval(interval);
        callback();
      }
    }, 450);
  };

  const handleCompileDream = async (e: FormEvent) => {
    e.preventDefault();
    if (!theme.trim() || isCompiling) return;

    setIsCompiling(true);
    setCompiledDream(null);

    // Run the fancy scrolling console logs first for immersion
    triggerConsoleLogs(async () => {
      try {
        const response = await fetch("/api/dream/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            theme,
            setting,
            companion,
            mood
          })
        });

        if (!response.ok) {
          throw new Error(`Server returned HTTP ${response.status}`);
        }

        const data: BuiltDream = await response.json();
        
        // Add source info
        const fullyCompiledDream = {
          ...data,
          theme,
          setting,
          companion,
          mood
        };

        setCompiledDream(fullyCompiledDream);
        onDreamCompiled(fullyCompiledDream);
      } catch (err) {
        console.error("Failed to compile dream protocol via Gemini server:", err);
      } finally {
        setIsCompiling(false);
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto select-none" id="dream-builder-wrapper">
      
      {/* Title HUD block */}
      <header className="glass-panel px-6 py-4 rounded-xl border border-cyan-500/10 flex items-center justify-between" id="builder-header">
        <div className="flex items-center gap-3" id="builder-header-title">
          <Wand2 className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="font-display font-medium text-sm tracking-widest text-cyan-200">NEURAL DREAM COMPILER</h2>
            <p className="text-[10px] font-mono text-slate-400/50">CORTICAL VOLUMETRIC SEQUENCE SYNTHESIZER</p>
          </div>
        </div>
        <div className="text-xs font-mono text-cyan-400 border border-cyan-500/20 bg-cyan-950/15 px-3 py-1 rounded" id="builder-header-status">
          RENDER MATRIX: GROUNDED
        </div>
      </header>

      {/* Split layout: input form on left, compiled protocol output on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="builder-grid-container">
        
        {/* LEFT COLUMN: Synthesis controls (5 cols) - Highest Elevation */}
        <section className="lg:col-span-5 glass-panel p-6 flex flex-col justify-between" id="synthesis-panel">
          <div className="border-b border-cyan-500/10 pb-3 mb-4" id="synthesis-header">
            <h3 className="font-display font-medium text-xs tracking-widest text-slate-300">DREAM SOURCE MATERIAL</h3>
            <p className="text-[9px] font-mono text-slate-400/50 mt-0.5">FEED SUB-CONSCIOUS VARIABLES TO CHIP COMPILER</p>
          </div>

          <form onSubmit={handleCompileDream} className="space-y-4 flex-1" id="synthesis-form">
            {/* Theme Text Area */}
            <div className="space-y-1.5" id="synthesis-theme-input">
              <label className="text-[10px] font-mono text-slate-300 uppercase tracking-wider block">1. SYNAPTIC FOCUS ELEMENT (DREAM CORE THEME)</label>
              <textarea
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="What dream concepts do you wish to manifest? (e.g., 'Sailing an ancient wooden galleon through a swirling violet gas giant planetary nebula...')"
                disabled={isCompiling}
                required
                className="w-full h-24 p-3.5 glass-input text-xs text-cyan-200 placeholder-slate-500/40 resize-none font-sans leading-relaxed"
                id="form-theme-textarea"
              />
            </div>

            {/* Backdrop dropdown */}
            <div className="space-y-1.5" id="synthesis-backdrop-dropdown">
              <label className="text-[10px] font-mono text-slate-300 uppercase tracking-wider block">2. CORTICAL VOLUMETRIC BACKDROP (SETTING)</label>
              <select
                value={setting}
                onChange={(e) => setSetting(e.target.value)}
                disabled={isCompiling}
                className="w-full p-3 glass-input text-xs text-cyan-200"
                id="form-setting-select"
              >
                {settingsList.map((set, idx) => (
                  <option key={idx} value={set} className="bg-[#0b1022] text-cyan-200">
                    {set}
                  </option>
                ))}
              </select>
            </div>

            {/* Companion dropdown */}
            <div className="space-y-1.5" id="synthesis-companion-dropdown">
              <label className="text-[10px] font-mono text-slate-300 uppercase tracking-wider block">3. VOLUMETRIC MATRIX CO-ANCHOR (COMPANION)</label>
              <select
                value={companion}
                onChange={(e) => setCompanion(e.target.value)}
                disabled={isCompiling}
                className="w-full p-3 glass-input text-xs text-cyan-200"
                id="form-companion-select"
              >
                {companionsList.map((comp, idx) => (
                  <option key={idx} value={comp} className="bg-[#0b1022] text-cyan-200">
                    {comp}
                  </option>
                ))}
              </select>
            </div>

            {/* Mood selector buttons */}
            <div className="space-y-1.5" id="synthesis-mood-selector">
              <label className="text-[10px] font-mono text-slate-300 uppercase tracking-wider block">4. EMOTIONAL INTENSITY POLARIZATION (MOOD)</label>
              <div className="grid grid-cols-3 gap-2" id="mood-button-grid">
                {["lucid", "peaceful", "nightmare"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    disabled={isCompiling}
                    className={`py-2 px-2.5 rounded border text-[10px] font-display font-medium tracking-widest transition-all duration-300 uppercase ${
                      mood === m
                        ? m === "nightmare"
                          ? "bg-rose-950/40 border-rose-800 text-rose-300 shadow-sm"
                          : "bg-cyan-950/40 border-cyan-500/30 text-cyan-300 shadow-sm"
                        : "border-slate-500/10 text-slate-400/60 hover:text-slate-300"
                    }`}
                    id={`form-mood-btn-${m}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Action compilation trigger */}
            <div className="pt-4" id="compile-btn-container">
              <button
                type="submit"
                disabled={!theme.trim() || isCompiling}
                className={`w-full py-4 rounded-lg font-display text-xs tracking-widest border flex items-center justify-center gap-2.5 transition-all duration-300 ${
                  isCompiling
                    ? "text-cyan-400 border-cyan-500/30 bg-cyan-950/20 cursor-wait"
                    : !theme.trim()
                    ? "text-slate-400/40 border-slate-500/5 bg-transparent cursor-not-allowed"
                    : "glass-button text-cyan-300 hover:text-cyan-200 border-cyan-500/30 font-semibold"
                }`}
                id="form-compile-submit"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCompiling ? "animate-spin" : ""}`} />
                {isCompiling ? "INDUCTING THETA BRIDGE INTERLINK..." : "COMPILE DREAM ARCHITECTURE"}
              </button>
            </div>
          </form>
        </section>

        {/* RIGHT COLUMN: Real compiled output, or streaming console logs (7 cols) - Highest Elevation */}
        <section className="lg:col-span-7 glass-panel p-6 flex flex-col justify-between min-h-[480px]" id="compiled-display-panel">
          
          <div className="border-b border-cyan-500/10 pb-3 mb-4" id="compiled-panel-header">
            <h3 className="font-display font-medium text-xs tracking-widest text-slate-300">COMPILED DREAM PROTOCOL</h3>
            <p className="text-[9px] font-mono text-slate-400/50 mt-0.5">SYNAPTIC INLAY RENDER PROTOCOLS</p>
          </div>

          <div className="flex-1 flex flex-col justify-center" id="compiled-panel-body">
            {isCompiling ? (
              /* Live Scrolling Hacking-like logs terminal */
              <div className="bg-black/40 border border-cyan-500/10 p-5 rounded-lg h-full min-h-[340px] flex flex-col justify-between font-mono text-[10px] leading-relaxed" id="compiling-logs-box">
                <div className="flex items-center justify-between border-b border-cyan-500/10 pb-2 mb-3" id="logs-box-header">
                  <span className="text-cyan-400 flex items-center gap-1.5 animate-pulse">
                    <Terminal className="w-3.5 h-3.5" /> SYNAPTIC INDUCTION TERMINAL
                  </span>
                  <span className="text-slate-500">NOX_COMPILER v1.2</span>
                </div>
                <div className="space-y-2 flex-1 overflow-y-auto" id="logs-box-content">
                  {consoleLogs.map((log, i) => (
                    <div key={i} className={log.startsWith("CRITICAL") ? "text-rose-400" : log.startsWith("SUCCESS") ? "text-emerald-400 font-bold" : "text-cyan-300/80"} id={`compile-terminal-log-${i}`}>
                      &gt;&gt; {log}
                    </div>
                  ))}
                </div>
                <div className="text-center pt-4 border-t border-cyan-500/5" id="logs-box-footer">
                  <span className="text-[9px] text-slate-400/30 uppercase tracking-widest block">COUPLING SYNAPSES EN-ROUTE...</span>
                </div>
              </div>
            ) : compiledDream ? (
              /* Real synthesized dream protocol screen */
              <div className="space-y-4 h-full" id="compiled-readout-box">
                
                {/* Protocol summary block */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border border-cyan-500/15 bg-cyan-950/20 p-4 rounded-lg gap-4 text-xs select-text" id="readout-summary">
                  <div id="summary-meta">
                    <span className="text-[8px] font-mono text-slate-400/50 uppercase">COMPILED PROTOCOL:</span>
                    <span className="block font-display font-bold text-cyan-200 tracking-widest text-sm uppercase mt-0.5">
                      {compiledDream.protocolName}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-left font-mono" id="summary-metrics">
                    <div id="summary-freq">
                      <span className="block text-[8px] text-slate-400/50 uppercase">RECOMMENDED FREQ</span>
                      <span className="text-cyan-300 font-bold">{compiledDream.frequency}</span>
                    </div>
                    <div id="summary-stability">
                      <span className="block text-[8px] text-slate-400/50 uppercase">STABILITY</span>
                      <span className="text-emerald-400 font-bold">{compiledDream.stabilityRating}%</span>
                    </div>
                  </div>
                </div>

                {/* Highly poetic story narrative text */}
                <div className="space-y-1" id="readout-narrative-box">
                  <span className="text-[8px] font-mono text-slate-400/55 uppercase tracking-wider block">manifested dream narrative script</span>
                  <div className="max-h-52 overflow-y-auto font-sans text-xs text-cyan-200/90 leading-relaxed bg-cyan-950/25 border border-cyan-500/5 p-4 rounded-lg space-y-3 select-text select-all">
                    {compiledDream.narrative.split("\n\n").map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>
                </div>

                {/* Volumetric render components */}
                <div className="space-y-1.5" id="readout-components-box">
                  <span className="text-[8px] font-mono text-slate-400/55 uppercase tracking-wider block">synthesized somatic render components</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono" id="readout-components-grid">
                    {compiledDream.components.map((comp, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg border border-cyan-500/10 bg-cyan-950/10 text-cyan-300 tracking-wide" id={`readout-comp-${idx}`}>
                        [✓] {comp}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk profile bar */}
                <div className="flex justify-between items-center text-[10px] font-mono border-t border-cyan-500/10 pt-3" id="readout-footer">
                  <span className="text-slate-400/60 uppercase">NEURAL RISK LEVEL:</span>
                  <span className={`font-bold uppercase tracking-widest ${
                    compiledDream.riskFactor === "HIGH" ? "text-rose-400 animate-pulse" : "text-emerald-400"
                  }`}>
                    {compiledDream.riskFactor} RISK LEVEL
                  </span>
                </div>

              </div>
            ) : (
              /* Uncompiled waiting screen */
              <div className="text-center p-8 border border-cyan-500/10 bg-cyan-950/10 rounded-xl space-y-4 h-full min-h-[340px] flex flex-col justify-center items-center" id="compiled-uncompiled-placeholder">
                <div className="p-3 bg-cyan-950/10 border border-cyan-500/25 rounded-full text-cyan-400 glow-pulse" id="placeholder-icon-box">
                  <Wand2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs tracking-widest text-slate-300">COMPILATION SYSTEM READY</h4>
                  <p className="text-xs font-sans text-slate-400/60 mt-1 max-w-sm mx-auto leading-relaxed">
                    Custom volumetric rendering is standby. Provide your dream core theme in the source panel on the left and trigger compilation to synthesize your dream script using deep Gemini grounding.
                  </p>
                </div>
              </div>
            )}
          </div>

        </section>

      </div>

    </div>
  );
}
