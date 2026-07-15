import { useState } from "react";
import { Database, ShieldCheck, Cpu, RefreshCw, Zap, Wrench, ShieldAlert } from "lucide-react";

interface MemoryModule {
  id: string;
  name: string;
  timestamp: string;
  status: "SECURED" | "CORRUPTED" | "RECONSTRUCTING";
  category: "Emotional" | "Spatial" | "Acoustic" | "Somatic";
  corruptionLevel: number; // percentage
  targetFreq: number; // for the minigame, e.g. 42
  targetPhase: number; // for the minigame, e.g. 110
}

export default function MemoryVaultView() {
  const [modules, setModules] = useState<MemoryModule[]>([
    {
      id: "mem-01",
      name: "RECALL-293: GRADUATION_ACCORD",
      timestamp: "12 JUN 2028",
      status: "SECURED",
      category: "Emotional",
      corruptionLevel: 0,
      targetFreq: 45,
      targetPhase: 90
    },
    {
      id: "mem-02",
      name: "RECALL-084: ABYSSAL_RESONANCE_CHORD",
      timestamp: "04 FEB 2036",
      status: "CORRUPTED",
      category: "Acoustic",
      corruptionLevel: 84,
      targetFreq: 38,
      targetPhase: 160
    },
    {
      id: "mem-03",
      name: "RECALL-910: NEON_TOKYO_SKYLINE",
      timestamp: "21 SEP 2040",
      status: "SECURED",
      category: "Spatial",
      corruptionLevel: 0,
      targetFreq: 60,
      targetPhase: 120
    },
    {
      id: "mem-04",
      name: "RECALL-112: CHRONO_GLITCH_COLLAPSE",
      timestamp: "02 APR 2041",
      status: "CORRUPTED",
      category: "Somatic",
      corruptionLevel: 92,
      targetFreq: 75,
      targetPhase: 45
    },
    {
      id: "mem-05",
      name: "RECALL-409: APEX_SNOW_PEAK_ASCENT",
      timestamp: "02 JUL 2042",
      status: "SECURED",
      category: "Spatial",
      corruptionLevel: 0,
      targetFreq: 50,
      targetPhase: 80
    }
  ]);

  const [activeModuleId, setActiveModuleId] = useState<string>("mem-02");
  
  // Game states
  const [currentFreq, setCurrentFreq] = useState<number>(10);
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [injecting, setInjecting] = useState<boolean>(false);
  const [injectProgress, setInjectProgress] = useState<number>(0);

  const activeModule = modules.find(m => m.id === activeModuleId) || modules[0];

  // Check if aligned
  const isFreqAligned = Math.abs(currentFreq - activeModule.targetFreq) <= 3;
  const isPhaseAligned = Math.abs(currentPhase - activeModule.targetPhase) <= 8;
  const isAligned = isFreqAligned && isPhaseAligned;

  const handleSelectModule = (id: string) => {
    setActiveModuleId(id);
    const mod = modules.find(m => m.id === id);
    if (mod) {
      // Reset sliders with slight offset
      setCurrentFreq(15);
      setCurrentPhase(20);
      setInjectProgress(0);
    }
  };

  const handleInjectInlay = () => {
    if (!isAligned || injecting) return;
    setInjecting(true);
    setInjectProgress(0);

    const interval = setInterval(() => {
      setInjectProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setModules(prevMods => prevMods.map(m => {
            if (m.id === activeModuleId) {
              return { ...m, status: "SECURED", corruptionLevel: 0 };
            }
            return m;
          }));
          setInjecting(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto select-none animate-fade-in" id="memory-vault-wrapper">
      
      {/* Title HUD Bar */}
      <header className="glass-panel px-6 py-4 rounded-xl border border-purple-500/10 flex items-center justify-between" id="vault-header">
        <div className="flex items-center gap-3" id="vault-header-title">
          <Database className="w-5 h-5 text-purple-400" />
          <div>
            <h2 className="font-display font-medium text-sm tracking-widest text-purple-200">MEMORY ARCHIVE COCKPIT</h2>
            <p className="text-[10px] font-mono text-purple-400/50">SUB-CORTICAL SECTOR SEGMENT STORAGE</p>
          </div>
        </div>
        <div className="text-xs font-mono text-cyan-400 border border-cyan-500/20 bg-cyan-950/15 px-3 py-1 rounded" id="vault-header-index">
          TOTAL SECURED BLOCKS: {modules.filter(m => m.status === "SECURED").length} / {modules.length}
        </div>
      </header>

      {/* Main split dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="vault-grid-container">
        
        {/* LEFT COLUMN: List of memories (5 cols) - Highest Elevation */}
        <section className="lg:col-span-5 glass-panel-heavy p-6 flex flex-col justify-between" id="vault-list-panel">
          <div className="border-b border-purple-500/10 pb-3 mb-4" id="vault-list-header">
            <h3 className="font-display font-medium text-xs tracking-widest text-purple-300">CORTICAL ARCHIVE CORE</h3>
            <p className="text-[9px] font-mono text-purple-400/50 mt-0.5">SELECT FRAGMENT FOR TELEMETRY ANALYSIS</p>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[420px] pr-2" id="vault-modules-list">
            {modules.map((mod) => {
              const isActive = mod.id === activeModuleId;
              return (
                <div
                  key={mod.id}
                  id={`vault-item-row-${mod.id}`}
                  onClick={() => handleSelectModule(mod.id)}
                  className={`p-4 rounded-lg border cursor-pointer flex items-center justify-between transition-all duration-300 ${
                    isActive
                      ? "bg-purple-950/25 border-cyan-500/35 shadow-[0_0_12px_rgba(6,182,212,0.1)] scale-[1.01]"
                      : "bg-purple-950/5 border-purple-500/10 hover:border-purple-500/20 hover:translate-x-1"
                  }`}
                >
                  <div className="space-y-1.5" id={`vault-item-meta-${mod.id}`}>
                    <span className="text-[8px] font-mono text-purple-400/60 uppercase">{mod.category} // {mod.timestamp}</span>
                    <h4 className={`font-display text-xs tracking-widest leading-none font-bold ${
                      isActive ? "text-neon-cyan" : "text-purple-300"
                    }`}>
                      {mod.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2.5" id={`vault-item-status-${mod.id}`}>
                    {mod.status === "CORRUPTED" && (
                      <span className="text-[8px] font-mono text-rose-400 bg-rose-950/15 border border-rose-500/20 px-2 py-0.5 rounded animate-pulse">
                        CORRUPT: {mod.corruptionLevel}%
                      </span>
                    )}
                    {mod.status === "SECURED" && (
                      <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/15 border border-emerald-500/20 px-2 py-0.5 rounded">
                        SECURED
                      </span>
                    )}
                    <div className={`w-2.5 h-2.5 rounded-full border ${
                      mod.status === "SECURED" ? "bg-emerald-400 border-emerald-300" : "bg-rose-500 border-rose-400 animate-ping"
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RIGHT COLUMN: Interactive Repair minigame cockpit (7 cols) - Highest Elevation */}
        <section className="lg:col-span-7 glass-panel-heavy p-6 flex flex-col justify-between" id="vault-repair-panel">
          
          <div className="border-b border-purple-500/10 pb-3 mb-4" id="vault-repair-header">
            <h3 className="font-display font-medium text-xs tracking-widest text-purple-300 uppercase">NEURAL RECONSTRUCTION MATRIX</h3>
            <p className="text-[9px] font-mono text-purple-400/50 mt-0.5">SYNAPTIC BRIDGE SIGNAL COUPLER</p>
          </div>

          <div className="flex-1 flex flex-col justify-between" id="vault-matrix-body">
            
            {/* Status of Selected Module */}
            <div className="flex items-start justify-between border border-purple-500/10 bg-purple-950/20 p-4 rounded-lg text-xs" id="repair-active-status">
              <div>
                <span className="text-[8px] font-mono text-purple-400/50 uppercase">TARGET FRAGMENT:</span>
                <span className="block font-display font-bold text-neon-purple tracking-widest uppercase mt-0.5">{activeModule.name}</span>
              </div>
              <div className="text-right" id="repair-active-specs">
                <span className="block text-[8px] font-mono text-purple-400/50 uppercase">TARGET ALIGNMENT:</span>
                <span className="block font-mono text-cyan-300 font-bold uppercase mt-0.5">
                  {activeModule.targetFreq}Hz // {activeModule.targetPhase}°
                </span>
              </div>
            </div>

            {/* Minigame sliders matrix */}
            {activeModule.status === "CORRUPTED" ? (
              <div className="my-6 space-y-6" id="repair-minigame-gameboard">
                
                {/* Visual Alignment representation */}
                <div className="border border-purple-500/10 bg-purple-950/30 h-28 rounded-lg p-3 relative flex flex-col justify-between" id="repair-visualizer-box">
                  <span className="text-[8px] font-mono text-purple-400/40 uppercase absolute top-2 left-2">SYNAPTIC OVERLAY MATRIX</span>
                  
                  {/* Glowing overlapping wave animations or alignment gauges */}
                  <div className="flex-1 flex items-center justify-around px-4" id="repair-oscillating-bars">
                    {/* Frequency comparison */}
                    <div className="text-center w-full max-w-[120px] flex flex-col gap-1.5" id="alignment-col-freq">
                      <span className="text-[8px] font-mono text-purple-400/60 uppercase">FREQ COUPLING</span>
                      <div className="h-4 w-full bg-purple-950 rounded border border-purple-500/10 overflow-hidden relative">
                        <div 
                          className={`h-full absolute left-0 top-0 transition-all duration-300 ${isFreqAligned ? "bg-cyan-500" : "bg-rose-500"}`} 
                          style={{ width: `${Math.max(10, 100 - Math.abs(currentFreq - activeModule.targetFreq) * 5)}%` }} 
                        />
                      </div>
                      <span className={`font-mono text-[9px] font-bold ${isFreqAligned ? "text-cyan-300" : "text-rose-400"}`}>
                        {isFreqAligned ? "ALIGNMENT LOCKED" : "UNALIGNED"}
                      </span>
                    </div>

                    {/* Divider line */}
                    <div className="w-[1px] h-12 bg-purple-500/10" />

                    {/* Phase comparison */}
                    <div className="text-center w-full max-w-[120px] flex flex-col gap-1.5" id="alignment-col-phase">
                      <span className="text-[8px] font-mono text-purple-400/60 uppercase">PHASE HARMONY</span>
                      <div className="h-4 w-full bg-purple-950 rounded border border-purple-500/10 overflow-hidden relative">
                        <div 
                          className={`h-full absolute left-0 top-0 transition-all duration-300 ${isPhaseAligned ? "bg-cyan-500" : "bg-rose-500"}`} 
                          style={{ width: `${Math.max(10, 100 - Math.abs(currentPhase - activeModule.targetPhase) * 2.5)}%` }} 
                        />
                      </div>
                      <span className={`font-mono text-[9px] font-bold ${isPhaseAligned ? "text-cyan-300" : "text-rose-400"}`}>
                        {isPhaseAligned ? "PHASE LOCKED" : "UNALIGNED"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-mono border-t border-purple-500/10 pt-2" id="repair-visualizer-footer">
                    <span>OVERLAY ERROR RATIO: {Math.max(0, Math.floor(Math.abs(currentFreq - activeModule.targetFreq) + Math.abs(currentPhase - activeModule.targetPhase) / 2))}%</span>
                    <span className={`font-semibold ${isAligned ? "text-cyan-400 glow-pulse" : "text-rose-400"}`}>
                      {isAligned ? "READY FOR SYNAPTIC INLAY INJECTION" : "TUNING REQUIRED"}
                    </span>
                  </div>
                </div>

                {/* SLIDERS INPUT */}
                <div className="space-y-4" id="repair-sliders-container">
                  {/* Frequency tuning */}
                  <div className="space-y-1" id="tuning-row-frequency">
                    <div className="flex justify-between text-[10px] font-mono" id="label-freq-tuning">
                      <span className="text-purple-300">SYNAPTIC BRIDGE FREQUENCY</span>
                      <span className="text-cyan-300 font-bold">{currentFreq} Hz / Target: {activeModule.targetFreq} Hz</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={currentFreq}
                      onChange={(e) => setCurrentFreq(parseInt(e.target.value))}
                      disabled={injecting}
                      className="w-full h-1.5 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      id="input-tuning-freq"
                    />
                  </div>

                  {/* Phase tuning */}
                  <div className="space-y-1" id="tuning-row-phase">
                    <div className="flex justify-between text-[10px] font-mono" id="label-phase-tuning">
                      <span className="text-purple-300">COGNITIVE INTERLACE PHASE</span>
                      <span className="text-cyan-300 font-bold">{currentPhase}° / Target: {activeModule.targetPhase}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="180"
                      value={currentPhase}
                      onChange={(e) => setCurrentPhase(parseInt(e.target.value))}
                      disabled={injecting}
                      className="w-full h-1.5 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      id="input-tuning-phase"
                    />
                  </div>
                </div>

              </div>
            ) : (
              /* Healthy Secured Display */
              <div className="my-8 text-center p-8 border border-emerald-500/15 bg-emerald-950/5 rounded-xl space-y-3 flex-1 flex flex-col items-center justify-center" id="repair-secured-box">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full glow-pulse" id="secured-icon-wrapper">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm tracking-widest text-emerald-300">MEMORY SECTOR HYPER-HEALTHY</h4>
                  <p className="text-xs font-sans text-purple-400/70 mt-1 max-w-sm">
                    Synaptic bridging verified. All sector indices are securely anchored, and memory encryption signatures match root matrices perfectly.
                  </p>
                </div>
              </div>
            )}

            {/* CTA action trigger button */}
            <div id="repair-matrix-actions">
              {activeModule.status === "CORRUPTED" && (
                <div className="space-y-4" id="inject-action-block">
                  {injectProgress > 0 && (
                    <div className="space-y-1.5" id="inject-progress-bar-container">
                      <div className="flex justify-between text-[9px] font-mono" id="inject-progress-labels">
                        <span className="text-purple-400/60">SYNAPTIC BRIDGE COUPLER PROGRESS</span>
                        <span>{injectProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-purple-950/50 border border-purple-500/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)] rounded-full transition-all duration-300"
                          style={{ width: `${injectProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleInjectInlay}
                    disabled={!isAligned || injecting}
                    className={`w-full py-4 rounded-lg font-display text-xs tracking-widest border flex items-center justify-center gap-2.5 transition-all duration-300 ${
                      injecting
                        ? "text-cyan-400 border-cyan-500/30 bg-cyan-950/20 cursor-wait"
                        : !isAligned
                        ? "text-purple-400/40 border-purple-500/5 bg-transparent cursor-not-allowed"
                        : "glass-button text-cyan-300 hover:text-cyan-200 border-cyan-500/30"
                    }`}
                    id="inject-inlay-btn"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    {injecting ? "ALIGNING BRIDGE SYNERGY..." : "INJECT SYNAPTIC MEMORY INLAY"}
                  </button>
                </div>
              )}
            </div>

          </div>

        </section>

      </div>

    </div>
  );
}
