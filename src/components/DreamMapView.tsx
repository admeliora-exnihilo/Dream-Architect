import { useState, Dispatch, SetStateAction } from "react";
import { Map, RefreshCw, Radio, ShieldAlert, ArrowUpRight, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomDreamNode } from "../types";

interface DreamMapViewProps {
  nodes: CustomDreamNode[];
  setNodes: Dispatch<SetStateAction<CustomDreamNode[]>>;
}

export default function DreamMapView({ nodes, setNodes }: DreamMapViewProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(() => {
    return nodes.length > 0 ? nodes[nodes.length - 1].id : "drowning-city";
  });
  const [calibrating, setCalibrating] = useState<boolean>(false);
  const [calibrated, setCalibrated] = useState<boolean>(false);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const handleNodeClick = (id: string) => {
    setSelectedNodeId(id);
    setCalibrated(false);
  };

  const handleIntensityChange = (newValue: number) => {
    setNodes(prev => prev.map(n => {
      if (n.id === selectedNodeId) {
        return { ...n, activity: newValue };
      }
      return n;
    }));
  };

  const runCalibration = () => {
    setCalibrating(true);
    setTimeout(() => {
      setCalibrating(false);
      setCalibrated(true);
      // Bring intensity down to stable 45% if it was a nightmare node
      if (selectedNode.type === "nightmare") {
        handleIntensityChange(45);
      } else {
        handleIntensityChange(Math.max(30, Math.floor(Math.random() * 20 + 40)));
      }
    }, 2000);
  };

  // Node color helper matches legend
  const getNodeColor = (type: string) => {
    switch (type) {
      case "nightmare": return "#b91c1c"; // lower saturation red-700
      case "lucid": return "#0891b2"; // soft cyan-600
      case "anomaly": return "#a1824a"; // muted golden sand / low saturation amber
      case "memory": return "#475569"; // muted slate blue-600
      default: return "#0891b2";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto select-none" id="dream-map-wrapper">
      
      {/* TOP HEADER HUD */}
      <header className="flex flex-wrap items-center justify-between gap-4 glass-panel px-6 py-4 rounded-xl border border-cyan-500/10" id="dream-map-hud">
        <div className="flex items-center gap-4" id="dream-map-mission">
          <div className="relative flex items-center justify-center" id="live-map-active-indicator">
            <span className="absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </div>
          <div id="dream-map-mission-text">
            <span className="text-[10px] font-mono text-cyan-400/60 tracking-widest block leading-none">[ MISSION ACTIVE ]</span>
            <span className="text-xs font-display font-medium tracking-widest text-cyan-200">SUBJECT A-17 // AURELIA VEX</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono" id="dream-map-status-row">
          <div className="border border-cyan-500/20 bg-cyan-950/20 px-4 py-2 rounded-lg flex flex-col justify-center min-w-[110px]" id="map-status-box">
            <span className="text-[9px] text-cyan-400/50 uppercase tracking-wider">STATUS</span>
            <span className="font-sans font-semibold text-emerald-400 tracking-widest uppercase">REM DEEP</span>
          </div>

          <div className="border border-cyan-500/20 bg-cyan-950/20 px-4 py-2 rounded-lg flex flex-col justify-center min-w-[110px]" id="map-clock-box">
            <span className="text-[9px] text-cyan-400/50 uppercase tracking-wider">TIME SLICE</span>
            <span className="font-sans font-semibold text-cyan-300 tracking-widest">16:47:55</span>
          </div>
        </div>
      </header>

      {/* CORE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dream-map-core-grid">
        
        {/* LEFT COLUMN: THE CONSTELLATION MAP (8 cols) */}
        <section className="lg:col-span-8 glass-panel rounded-xl p-6 relative overflow-hidden min-h-[520px] flex flex-col justify-between" id="dream-map-main-canvas">
          
          {/* Internal Header inside panel */}
          <div className="flex items-center justify-between border-b border-cyan-500/10 pb-4 mb-4 z-10 relative" id="cartography-internal-header">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span className="text-xs font-display font-bold tracking-widest text-cyan-100">DREAM CARTOGRAPHY</span>
            </div>
            
            <div className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-950/30 px-3 py-1 rounded-full text-[9px] text-emerald-400 font-mono font-semibold tracking-wider animate-pulse" id="live-mapping-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              LIVE MAPPING
            </div>
          </div>

          {/* Interactive Concentric Orbit Container */}
          <div className="flex-1 relative w-full h-[380px] flex items-center justify-center" id="orbital-graph-container">
            
            {/* 4 Concentric Orbit Ellipses */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" id="orbits-background">
              {/* Inner Circle (Orbit 1) */}
              <div className="absolute rounded-full border border-cyan-500/[0.08] w-[20%] aspect-square flex items-center justify-center" />
              {/* Middle Circle 1 (Orbit 2) */}
              <div className="absolute rounded-full border border-cyan-500/[0.10] w-[40%] aspect-square flex items-center justify-center" />
              {/* Middle Circle 2 (Orbit 3) */}
              <div className="absolute rounded-full border border-cyan-500/[0.12] w-[64%] aspect-square flex items-center justify-center" />
              {/* Outer Circle (Orbit 4) */}
              <div className="absolute rounded-full border border-cyan-500/[0.07] w-[88%] aspect-square flex items-center justify-center" />
              
              {/* Crosshair guidelines */}
              <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-cyan-500/[0.04] to-transparent" />
              <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/[0.04] to-transparent" />
            </div>

            {/* Constellation lines drawn dynamically based on node coordinates */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" id="orbit-svg-lines">
              {/* We connect the nodes with lines to match the constellation feel */}
              {/* THE DROWNING CITY -> MIRROR CORRIDOR */}
              <line x1="33%" y1="38%" x2="49%" y2="28%" stroke="rgba(6, 182, 212, 0.16)" strokeWidth="1" />
              {/* THE DROWNING CITY -> CRIMSON MEMORY */}
              <line x1="33%" y1="38%" x2="45%" y2="56%" stroke="rgba(6, 182, 212, 0.16)" strokeWidth="1" />
              {/* THE DROWNING CITY -> CHILDHOOD HOUSE */}
              <line x1="33%" y1="38%" x2="31%" y2="63%" stroke="rgba(6, 182, 212, 0.16)" strokeWidth="1" />
              
              {/* MIRROR CORRIDOR -> SOLAR FLARE */}
              <line x1="49%" y1="28%" x2="65%" y2="30%" stroke="rgba(6, 182, 212, 0.16)" strokeWidth="1" />
              {/* MIRROR CORRIDOR -> GARDEN OF ORION */}
              <line x1="49%" y1="28%" x2="58%" y2="44%" stroke="rgba(6, 182, 212, 0.16)" strokeWidth="1" />
              
              {/* SOLAR FLARE -> GARDEN OF ORION */}
              <line x1="65%" y1="30%" x2="58%" y2="44%" stroke="rgba(6, 182, 212, 0.16)" strokeWidth="1" />
              
              {/* GARDEN OF ORION -> INFINITE STAIRCASE */}
              <line x1="58%" y1="44%" x2="51%" y2="66%" stroke="rgba(6, 182, 212, 0.16)" strokeWidth="1" />
              {/* GARDEN OF ORION -> CRIMSON MEMORY */}
              <line x1="58%" y1="44%" x2="45%" y2="56%" stroke="rgba(6, 182, 212, 0.16)" strokeWidth="1" />

              {/* CRIMSON MEMORY -> CHILDHOOD HOUSE */}
              <line x1="45%" y1="56%" x2="31%" y2="63%" stroke="rgba(6, 182, 212, 0.16)" strokeWidth="1" />
              {/* CRIMSON MEMORY -> INFINITE STAIRCASE */}
              <line x1="45%" y1="56%" x2="51%" y2="66%" stroke="rgba(6, 182, 212, 0.16)" strokeWidth="1" />
            </svg>

            {/* Glowing nodes container */}
            {nodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              const nodeColor = getNodeColor(node.type);
              
              return (
                <div
                  key={node.id}
                  id={`cartography-node-${node.id}`}
                  onClick={() => handleNodeClick(node.id)}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer flex flex-col items-center group z-10"
                >
                  {/* Glowing Node Dot with layered rings */}
                  <div className="relative w-8 h-8 flex items-center justify-center" id={`node-glow-rings-${node.id}`}>
                    
                    {/* Pulsing ring */}
                    {isSelected && (
                      <span 
                        className="absolute w-7 h-7 rounded-full animate-ping opacity-60"
                        style={{ border: `2px solid ${nodeColor}` }}
                      />
                    )}

                    {/* Secondary interactive outline */}
                    <div 
                      className={`absolute w-5 h-5 rounded-full border transition-all duration-300 ${
                        isSelected 
                          ? "scale-125 bg-black/60" 
                          : "scale-100 bg-cyan-950/40 border-cyan-500/20 group-hover:border-cyan-400"
                      }`}
                      style={{ borderColor: isSelected ? nodeColor : undefined }}
                    />

                    {/* Core Solid Core */}
                    <div 
                      className="absolute w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor] transition-transform duration-300 group-hover:scale-125"
                      style={{ 
                        backgroundColor: nodeColor,
                        color: nodeColor
                      }}
                    />
                  </div>

                  {/* Node Label Floating Label (e.g. MIRROR CORRIDOR) */}
                  <div 
                    className={`mt-1 text-[8px] font-mono tracking-wider font-semibold transition-all duration-300 px-1.5 py-0.5 rounded ${
                      isSelected
                        ? "text-cyan-200 bg-cyan-950/60 border border-cyan-500/30"
                        : "text-slate-400/60 group-hover:text-cyan-300 bg-transparent border-transparent"
                    }`}
                    id={`node-text-label-${node.id}`}
                  >
                    {node.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer of the panel */}
          <div className="border-t border-cyan-500/10 pt-4 mt-2 flex items-center justify-between text-[10px] font-mono text-cyan-400/40" id="cartography-internal-footer">
            <span>COGNITIVE MATRIX STATUS: CALIBRATED</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> ALL CHANNELS ACTIVE
            </span>
          </div>

        </section>

        {/* RIGHT COLUMN: THE NODE INSPECTOR & LEGEND (4 cols) */}
        <section className="lg:col-span-4 flex flex-col gap-6" id="dream-map-inspector-container">
          
          {/* NODE INSPECTOR DRAWER */}
          <div className="glass-panel p-6 rounded-xl flex-1 flex flex-col justify-between" id="dream-map-node-inspector">
            
            <div className="flex items-center justify-between border-b border-cyan-500/10 pb-3" id="inspector-header">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span className="text-xs font-display font-bold tracking-widest text-cyan-200 uppercase">NODE INSPECTOR</span>
              </div>
              
              {/* Mode indicator (e.g. NIGHTMARE, ANOMALY, etc.) */}
              <span 
                className="text-[8px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded border uppercase animate-pulse"
                style={{ 
                  color: getNodeColor(selectedNode.type),
                  borderColor: `${getNodeColor(selectedNode.type)}40`,
                  backgroundColor: `${getNodeColor(selectedNode.type)}10`
                }}
                id="node-type-badge"
              >
                {selectedNode.type}
              </span>
            </div>

            {/* Selected Node Details */}
            <div className="flex-1 flex flex-col justify-center py-4 space-y-5" id="inspector-details">
              
              {/* LOCATION TITLE */}
              <div id="inspector-location-title">
                <span className="text-[8px] font-mono text-cyan-400/50 block tracking-widest">LOCATION</span>
                <h3 className="font-display font-semibold text-lg text-white tracking-widest leading-none mt-1">
                  {selectedNode.label}
                </h3>
              </div>

              {/* INTENSITY BAR */}
              <div className="space-y-1.5" id="inspector-intensity-slider">
                <div className="flex justify-between text-[9px] font-mono" id="intensity-label-row">
                  <span className="text-cyan-400/60 uppercase">INTENSITY</span>
                  <span 
                    className="font-bold tracking-wider"
                    style={{ color: getNodeColor(selectedNode.type) }}
                  >
                    {selectedNode.activity}%
                  </span>
                </div>
                {/* Visual Premium slider track */}
                <div className="relative" id="intensity-interactive-track">
                  <input
                    type="range"
                    min="15"
                    max="100"
                    value={selectedNode.activity}
                    onChange={(e) => handleIntensityChange(parseInt(e.target.value))}
                    className="w-full h-1 bg-cyan-950 rounded appearance-none cursor-pointer accent-cyan-400"
                    id="intensity-range-input"
                  />
                  <div 
                    className="h-1 bg-cyan-400 absolute top-1/2 -translate-y-1/2 left-0 pointer-events-none rounded transition-all"
                    style={{ 
                      width: `${selectedNode.activity}%`,
                      backgroundColor: getNodeColor(selectedNode.type),
                      boxShadow: `0 0 10px ${getNodeColor(selectedNode.type)}`
                    }}
                  />
                </div>
              </div>

              {/* THREE COLUMN STATS GRID */}
              <div className="grid grid-cols-3 gap-2 border-y border-cyan-500/10 py-3.5 text-center text-xs" id="inspector-stats-row">
                <div id="stat-depth-col">
                  <span className="block font-sans font-bold text-base text-white tracking-wider">
                    {selectedNode.stats.depthVal}
                  </span>
                  <span className="block text-[8px] font-mono text-cyan-400/40 uppercase mt-0.5">DEPTH</span>
                </div>
                <div className="border-x border-cyan-500/10" id="stat-echo-col">
                  <span className="block font-sans font-bold text-base text-white tracking-wider">
                    {selectedNode.stats.echoVal}
                  </span>
                  <span className="block text-[8px] font-mono text-cyan-400/40 uppercase mt-0.5">ECHO</span>
                </div>
                <div id="stat-drift-col">
                  <span className="block font-sans font-bold text-base text-white tracking-wider">
                    {selectedNode.stats.driftVal}
                  </span>
                  <span className="block text-[8px] font-mono text-cyan-400/40 uppercase mt-0.5">DRIFT</span>
                </div>
              </div>

              {/* COGNITIVE DESCRIPTION */}
              <div id="inspector-desc-box">
                <span className="block text-[8px] font-mono text-cyan-400/40 tracking-widest uppercase mb-1.5">NARRATIVE COUPLING PROFILE</span>
                <p className="text-[11px] font-sans text-cyan-200/70 leading-relaxed bg-cyan-950/20 border border-cyan-500/10 p-3 rounded-lg min-h-[70px]">
                  {selectedNode.description}
                </p>
              </div>

            </div>

            {/* ACTION BUTTON */}
            <div className="pt-2" id="inspector-action-btn-area">
              <button
                onClick={runCalibration}
                disabled={calibrating}
                className="w-full py-3 rounded-lg font-display text-[10px] font-semibold tracking-widest flex items-center justify-center gap-2 border transition-all duration-300 text-cyan-300 hover:text-cyan-200 border-cyan-500/30 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:bg-cyan-950/60"
                id="enter-node-button"
              >
                {calibrating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    STABILIZING NODE COUPLING...
                  </>
                ) : calibrated ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    NODE SECURED
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                    ENTER NODE
                  </>
                )}
              </button>
            </div>

          </div>

          {/* LEGEND PANEL */}
          <div className="glass-panel p-5 rounded-xl flex flex-col justify-between" id="dream-map-legend">
            <div className="border-b border-cyan-500/10 pb-2.5" id="legend-header">
              <span className="text-[9px] font-mono font-bold tracking-widest text-cyan-400/60 uppercase">LEGEND</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-3 text-[10px] font-mono text-cyan-300/70" id="legend-items">
              <div className="flex items-center gap-2" id="legend-nightmare">
                <span className="w-2.5 h-2.5 rounded-full inline-block shadow-[0_0_4px_rgba(185,28,28,0.4)]" style={{ backgroundColor: "#b91c1c" }} />
                <span className="uppercase">NIGHTMARE</span>
              </div>
              <div className="flex items-center gap-2" id="legend-anomaly">
                <span className="w-2.5 h-2.5 rounded-full inline-block shadow-[0_0_4px_rgba(161,130,74,0.4)]" style={{ backgroundColor: "#a1824a" }} />
                <span className="uppercase">ANOMALY</span>
              </div>
              <div className="flex items-center gap-2" id="legend-lucid">
                <span className="w-2.5 h-2.5 rounded-full inline-block shadow-[0_0_4px_rgba(8,145,178,0.4)]" style={{ backgroundColor: "#0891b2" }} />
                <span className="uppercase">LUCID</span>
              </div>
              <div className="flex items-center gap-2" id="legend-memory">
                <span className="w-2.5 h-2.5 rounded-full inline-block shadow-[0_0_4px_rgba(71,85,105,0.4)]" style={{ backgroundColor: "#475569" }} />
                <span className="uppercase">MEMORY</span>
              </div>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
