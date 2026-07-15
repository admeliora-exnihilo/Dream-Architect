import { useState } from "react";
import { Activity, ShieldAlert, Zap, Droplet, CheckCircle } from "lucide-react";
import { EmotionalLandscape } from "../types";

interface EmotionCenterViewProps {
  emotions: EmotionalLandscape;
  setEmotions: (emotions: EmotionalLandscape) => void;
}

export default function EmotionCenterView({ emotions, setEmotions }: EmotionCenterViewProps) {
  // Local temporary sliders
  const [serotonin, setSerotonin] = useState<number>(emotions.joy);
  const [dopamine, setDopamine] = useState<number>(emotions.trust);
  const [melatonin, setMelatonin] = useState<number>(emotions.sadness);
  const [cortisol, setCortisol] = useState<number>(emotions.fear);
  const [anger, setAnger] = useState<number>(emotions.anger);

  const [injecting, setInjecting] = useState<boolean>(false);
  const [injected, setInjected] = useState<boolean>(false);

  const handleInjectCocktail = () => {
    setInjecting(true);
    setInjected(false);

    setTimeout(() => {
      // Propagate local slider metrics to global cockpit emotions state
      setEmotions({
        fear: cortisol,
        joy: serotonin,
        trust: dopamine,
        sadness: melatonin,
        anger: anger
      });
      setInjecting(false);
      setInjected(true);
      
      // Hide injection success after 3 seconds
      setTimeout(() => setInjected(false), 3000);
    }, 2000);
  };

  const loadPreset = (preset: "lucid" | "nightmare" | "deep" | "zen") => {
    if (preset === "lucid") {
      setSerotonin(85);
      setDopamine(90);
      setMelatonin(55);
      setCortisol(20);
      setAnger(15);
    } else if (preset === "nightmare") {
      setSerotonin(15);
      setDopamine(25);
      setMelatonin(40);
      setCortisol(92);
      setAnger(80);
    } else if (preset === "deep") {
      setSerotonin(45);
      setDopamine(30);
      setMelatonin(95);
      setCortisol(10);
      setAnger(5);
    } else if (preset === "zen") {
      setSerotonin(75);
      setDopamine(60);
      setMelatonin(75);
      setCortisol(12);
      setAnger(8);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto select-none" id="emotion-center-wrapper">
      
      {/* Title HUD block */}
      <header className="glass-panel px-6 py-4 rounded-xl border border-slate-500/10 flex items-center justify-between" id="emotion-header">
        <div className="flex items-center gap-3" id="emotion-header-title">
          <Activity className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="font-display font-medium text-sm tracking-widest text-slate-200">NEUROMODULATOR FLUID INJECTORS</h2>
            <p className="text-[10px] font-mono text-slate-400/50">BIO-CHEMICAL TRANSMITTER INTERFACE</p>
          </div>
        </div>
        <div className="text-xs font-mono text-cyan-400 border border-cyan-500/20 bg-cyan-950/15 px-3 py-1 rounded" id="emotion-header-status">
          SYNAPSE BALANCER: OPERATIONAL
        </div>
      </header>

      {/* Preset Fast select card */}
      <section className="glass-panel p-5 rounded-xl border border-slate-500/10" id="presets-panel">
        <span className="text-[9px] font-mono text-slate-400/50 block uppercase mb-3">SYNAPTIC INJECTOR COCKTAIL PRESETS</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="presets-grid">
          <button
            onClick={() => loadPreset("lucid")}
            disabled={injecting}
            className="px-4 py-3 border border-cyan-500/20 bg-cyan-950/5 hover:bg-cyan-500/15 text-cyan-300 font-display text-[10px] tracking-widest rounded-lg transition-all duration-300 uppercase"
            id="preset-lucid-btn"
          >
            LUCID FLOW
          </button>
          <button
            onClick={() => loadPreset("nightmare")}
            disabled={injecting}
            className="px-4 py-3 border border-slate-500/20 bg-slate-950/5 hover:bg-slate-500/15 text-slate-300 font-display text-[10px] tracking-widest rounded-lg transition-all duration-300 uppercase"
            id="preset-nightmare-btn"
          >
            NIGHTMARE STIMULUS
          </button>
          <button
            onClick={() => loadPreset("deep")}
            disabled={injecting}
            className="px-4 py-3 border border-slate-500/20 bg-slate-950/5 hover:bg-slate-500/15 text-slate-300 font-display text-[10px] tracking-widest rounded-lg transition-all duration-300 uppercase"
            id="preset-deep-btn"
          >
            DEEP COMA ALPHA
          </button>
          <button
            onClick={() => loadPreset("zen")}
            disabled={injecting}
            className="px-4 py-3 border border-cyan-500/20 bg-cyan-950/5 hover:bg-cyan-500/15 text-cyan-300 font-display text-[10px] tracking-widest rounded-lg transition-all duration-300 uppercase"
            id="preset-zen-btn"
          >
            ZEN THETA CALM
          </button>
        </div>
      </section>

      {/* Main split display: dials on left, chemical logs on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="emotion-grid-container">
        
        {/* LEFT COLUMN: Dials / sliders inputs (7 cols) - Highest Elevation */}
        <section className="lg:col-span-7 glass-panel-heavy p-6 flex flex-col justify-between" id="injectors-panel">
          <div className="border-b border-slate-500/10 pb-3 mb-4" id="injectors-panel-header">
            <h3 className="font-display font-medium text-xs tracking-widest text-slate-300">BIOCHEMICAL REGULATION PANEL</h3>
            <p className="text-[9px] font-mono text-slate-400/50 mt-0.5">FINE-TUNE TRANSMITTER RATIOS BEFORE FLUID DEPLOYMENT</p>
          </div>

          <div className="space-y-5 flex-1 pr-2" id="injectors-sliders-list">
            
            {/* SEROTONIN */}
            <div className="space-y-1.5 p-3 rounded-lg border border-slate-500/10 bg-slate-950/10" id="injector-row-serotonin">
              <div className="flex justify-between items-center text-xs font-mono" id="label-serotonin">
                <span className="text-cyan-300 font-semibold flex items-center gap-1.5 uppercase">
                  <Droplet className="w-3.5 h-3.5" /> SEROTONIN INJECTOR (JOY / CALM)
                </span>
                <span className="text-cyan-300 font-bold">{serotonin}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={serotonin}
                onChange={(e) => setSerotonin(parseInt(e.target.value))}
                disabled={injecting}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                id="input-serotonin"
              />
            </div>

            {/* DOPAMINE */}
            <div className="space-y-1.5 p-3 rounded-lg border border-slate-500/10 bg-slate-950/10" id="injector-row-dopamine">
              <div className="flex justify-between items-center text-xs font-mono" id="label-dopamine">
                <span className="text-cyan-300 font-semibold flex items-center gap-1.5 uppercase">
                  <Droplet className="w-3.5 h-3.5" /> DOPAMINE INJECTOR (TRUST / FOCUS)
                </span>
                <span className="text-cyan-300 font-bold">{dopamine}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={dopamine}
                onChange={(e) => setDopamine(parseInt(e.target.value))}
                disabled={injecting}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                id="input-dopamine"
              />
            </div>

            {/* MELATONIN */}
            <div className="space-y-1.5 p-3 rounded-lg border border-slate-500/10 bg-slate-950/10" id="injector-row-melatonin">
              <div className="flex justify-between items-center text-xs font-mono" id="label-melatonin">
                <span className="text-cyan-300 font-semibold flex items-center gap-1.5 uppercase">
                  <Droplet className="w-3.5 h-3.5" /> MELATONIN INJECTOR (SLEEP DEPTH)
                </span>
                <span className="text-cyan-300 font-bold">{melatonin}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={melatonin}
                onChange={(e) => setMelatonin(parseInt(e.target.value))}
                disabled={injecting}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                id="input-melatonin"
              />
            </div>

            {/* CORTISOL */}
            <div className="space-y-1.5 p-3 rounded-lg border border-slate-500/10 bg-slate-950/10" id="injector-row-cortisol">
              <div className="flex justify-between items-center text-xs font-mono" id="label-cortisol">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5 uppercase">
                  <Droplet className="w-3.5 h-3.5 text-slate-400" /> CORTISOL INJECTOR (STRESS / FEAR)
                </span>
                <span className="text-slate-300 font-bold">{cortisol}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={cortisol}
                onChange={(e) => setCortisol(parseInt(e.target.value))}
                disabled={injecting}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-slate-400"
                id="input-cortisol"
              />
            </div>

            {/* ANGER/EPINEPHRINE */}
            <div className="space-y-1.5 p-3 rounded-lg border border-slate-500/10 bg-slate-950/10" id="injector-row-anger">
              <div className="flex justify-between items-center text-xs font-mono" id="label-anger">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5 uppercase">
                  <Droplet className="w-3.5 h-3.5 text-slate-400" /> EPINEPHRINE INJECTOR (ANGER / PULSE)
                </span>
                <span className="text-slate-300 font-bold">{anger}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={anger}
                onChange={(e) => setAnger(parseInt(e.target.value))}
                disabled={injecting}
                className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-slate-400"
                id="input-anger"
              />
            </div>

          </div>
        </section>

        {/* RIGHT COLUMN: Deployment center status (5 cols) - Highest Elevation */}
        <section className="lg:col-span-5 glass-panel-heavy p-6 flex flex-col justify-between" id="transmitter-panel">
          
          <div className="border-b border-slate-500/10 pb-3 mb-4" id="transmitter-panel-header">
            <h3 className="font-display font-medium text-xs tracking-widest text-slate-300">BIOCHEM REGULATION DEPLOYMENT</h3>
            <p className="text-[9px] font-mono text-slate-400/50 mt-0.5">SYNERGISTIC SIGNAL INTERLOCK LOCKOUTS</p>
          </div>

          {/* Interactive display */}
          <div className="flex-1 flex flex-col justify-center gap-6 my-4" id="transmitter-panel-body">
            
            {injected ? (
              <div className="p-5 border border-emerald-500/20 bg-emerald-950/10 rounded-xl text-center space-y-2 flex flex-col items-center justify-center animate-bounce" id="transmitter-success-box">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
                <h4 className="font-display font-semibold text-xs text-emerald-300 tracking-wider">NEUROTRANSMITTERS FLOODED</h4>
                <p className="text-[10px] font-mono text-slate-400/60">Somatic bridge updated successfully. Active EEG patterns stabilized.</p>
              </div>
            ) : (
              <div className="p-5 border border-cyan-500/10 bg-cyan-950/5 rounded-xl space-y-3 font-mono text-[9px] text-cyan-300/70" id="transmitter-specs-box">
                <span className="text-cyan-300 font-semibold block border-b border-cyan-500/10 pb-1.5 text-[10px] uppercase">COCKPIT INTERFACE TELEMETRY</span>
                <div className="flex justify-between items-center" id="chem-telemetry-serotonin">
                  <span>5-HT (SEROTONIN):</span>
                  <span className="text-cyan-300 font-bold">{serotonin} pg/ml</span>
                </div>
                <div className="flex justify-between items-center" id="chem-telemetry-dopamine">
                  <span>DA (DOPAMINE):</span>
                  <span className="text-cyan-300 font-bold">{dopamine} pg/ml</span>
                </div>
                <div className="flex justify-between items-center" id="chem-telemetry-melatonin">
                  <span>MT (MELATONIN):</span>
                  <span className="text-cyan-300 font-bold">{melatonin} pg/ml</span>
                </div>
                <div className="flex justify-between items-center" id="chem-telemetry-cortisol">
                  <span>CORT (CORTISOL):</span>
                  <span className="text-slate-400 font-bold">{cortisol} pg/ml</span>
                </div>
                <div className="flex justify-between items-center" id="chem-telemetry-anger">
                  <span>EPI (EPINEPHRINE):</span>
                  <span className="text-slate-400 font-bold">{anger} pg/ml</span>
                </div>

                {/* EMOTION SPECTRUM BAR GRAPH */}
                <div className="mt-4 pt-3 border-t border-cyan-500/10 space-y-3" id="emotion-bar-graph-section">
                  <span className="text-[10px] font-display font-medium tracking-widest text-cyan-200 block uppercase mb-1">
                    EMOTIONAL WAVEFORM SPECTRUM
                  </span>
                  
                  {/* Serotonin Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-mono text-cyan-400/60">
                      <span>SEROTONIN (JOY)</span>
                      <span>{serotonin}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-cyan-950/50 rounded-full overflow-hidden border border-cyan-500/5">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(6,182,212,0.15)]" 
                        style={{ width: `${serotonin}%` }}
                      />
                    </div>
                  </div>

                  {/* Dopamine Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-mono text-cyan-400/60">
                      <span>DOPAMINE (TRUST)</span>
                      <span>{dopamine}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-cyan-950/50 rounded-full overflow-hidden border border-cyan-500/5">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(6,182,212,0.15)]" 
                        style={{ width: `${dopamine}%` }}
                      />
                    </div>
                  </div>

                  {/* Melatonin Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-mono text-cyan-400/60">
                      <span>MELATONIN (SADNESS)</span>
                      <span>{melatonin}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-cyan-950/50 rounded-full overflow-hidden border border-cyan-500/5">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(6,182,212,0.15)]" 
                        style={{ width: `${melatonin}%` }}
                      />
                    </div>
                  </div>

                  {/* Cortisol Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-mono text-slate-400/60">
                      <span>CORTISOL (FEAR)</span>
                      <span>{cortisol}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950/50 rounded-full overflow-hidden border border-slate-500/5">
                      <div 
                        className="h-full bg-gradient-to-r from-slate-500 to-slate-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(148,163,184,0.15)]" 
                        style={{ width: `${cortisol}%` }}
                      />
                    </div>
                  </div>

                  {/* Anger Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-mono text-slate-400/60">
                      <span>EPINEPHRINE (ANGER)</span>
                      <span>{anger}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950/50 rounded-full overflow-hidden border border-slate-500/5">
                      <div 
                        className="h-full bg-gradient-to-r from-slate-500 to-slate-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(148,163,184,0.15)]" 
                        style={{ width: `${anger}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {cortisol > 80 && (
              <div className="p-3 bg-slate-950/20 border border-slate-500/30 text-slate-400 rounded-lg flex items-start gap-2.5 text-[10px] font-mono leading-relaxed" id="cortisol-danger-alert">
                <ShieldAlert className="w-4 h-4 shrink-0 animate-pulse mt-0.5" />
                <div>
                  <span className="font-bold block uppercase text-slate-300">HYPER-STRESS LEVEL WARNING</span>
                  Cortisol levels are in the critical danger zone. This may trigger intense nightmares, cerebral load spikes, and immediate system instability.
                </div>
              </div>
            )}
          </div>

          {/* Inject Action Button */}
          <div id="chemical-cocktail-actions">
            {injecting && (
              <div className="space-y-1.5 mb-4" id="inject-chemical-progress-box">
                <div className="flex justify-between text-[8px] font-mono text-slate-400/60 uppercase">
                  <span>DEPLOYING BIOCHEMICAL DOSAGE FLUIDS</span>
                  <span className="animate-pulse">DEPLOYING...</span>
                </div>
                <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-500/10">
                  <div className="h-full bg-cyan-400 animate-pulse" style={{ width: "100%" }} />
                </div>
              </div>
            )}

            <button
              onClick={handleInjectCocktail}
              disabled={injecting}
              className={`w-full py-4 rounded-lg font-display text-xs tracking-widest border flex items-center justify-center gap-2 transition-all duration-300 ${
                injecting
                  ? "text-cyan-400 border-cyan-500/30 bg-cyan-950/20 cursor-wait"
                  : "glass-button text-cyan-300 hover:text-cyan-200 border-cyan-500/30"
              }`}
              id="inject-cocktail-btn"
            >
              <Zap className="w-3.5 h-3.5" />
              {injecting ? "FLOODING NEURAL PATHWAYS..." : "DEPLOY CHEMICAL COCKTAIL"}
            </button>
          </div>

        </section>

      </div>

    </div>
  );
}
