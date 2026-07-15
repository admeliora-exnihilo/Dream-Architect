import { 
  LayoutDashboard, 
  Map, 
  Database, 
  Activity, 
  Wand2, 
  Settings, 
  Cpu 
} from "lucide-react";
import { PageType } from "../types";

interface SidebarProps {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  systemStatus: "OPTIMAL" | "STABLE" | "ERRATIC" | "CRITICAL";
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export default function Sidebar({ 
  activePage, 
  setActivePage, 
  systemStatus,
}: SidebarProps) {
  const menuItems = [
    { id: "dashboard" as PageType, label: "DASHBOARD", icon: LayoutDashboard },
    { id: "map" as PageType, label: "DREAM MAP", icon: Map },
    { id: "vault" as PageType, label: "MEMORY VAULT", icon: Database },
    { id: "emotion" as PageType, label: "EMOTION CENTER", icon: Activity },
    { id: "builder" as PageType, label: "DREAM BUILDER", icon: Wand2 },
  ];

  const getStatusColor = () => {
    switch (systemStatus) {
      case "OPTIMAL": return "text-emerald-400 border-emerald-500/15 bg-emerald-950/10";
      case "STABLE": return "text-cyan-400 border-cyan-500/15 bg-cyan-950/10";
      case "ERRATIC": return "text-amber-400 border-amber-500/15 bg-amber-950/10";
      case "CRITICAL": return "text-rose-400 border-rose-500/15 bg-rose-950/10";
      default: return "text-cyan-400 border-cyan-500/15 bg-cyan-950/10";
    }
  };

  return (
    <aside className="w-64 flex flex-col glass-panel-recessed border-r border-slate-500/15 h-full select-none shrink-0" id="sidebar-container">
      {/* Brand Logo Header */}
      <div className="p-6 border-b border-slate-500/10 flex items-center gap-3" id="sidebar-header">
        <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 glow-pulse" id="sidebar-logo-box">
          <Cpu className="w-6 h-6 text-cyan-400" id="sidebar-logo-icon" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg tracking-wider text-neon-cyan leading-tight" id="sidebar-title">
            NOX LAB
          </h1>
          <span className="text-[10px] font-mono tracking-widest text-slate-400/70" id="sidebar-subtitle">
            DREAM ARCHITECT
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto" id="sidebar-navigation">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-item-${item.id}`}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg font-display text-sm tracking-widest text-left transition-all duration-300 ${
                isActive
                  ? "bg-cyan-500/15 border-l-2 border-l-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.1)] font-medium"
                  : "text-slate-400/60 hover:text-cyan-200 hover:bg-slate-800/30 border-l-2 border-l-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-cyan-400" : "text-slate-500/40"}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Settings / Extra Footer info */}
      <div className="p-4 border-t border-slate-500/10 space-y-4" id="sidebar-footer">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500/50 px-2" id="sidebar-version-info">
          <span>STATION REF</span>
          <span>A-17 / COCKPIT</span>
        </div>

        {/* System Status Display Card */}
        <div 
          id="sidebar-status-card"
          className={`p-4 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all duration-500 ${getStatusColor()}`}
        >
          <span className="text-[10px] font-mono tracking-widest text-slate-400/50 uppercase">SYSTEM STATUS</span>
          <span className="text-sm font-display font-bold tracking-widest glow-pulse uppercase">
            {systemStatus}
          </span>
        </div>
      </div>
    </aside>
  );
}
