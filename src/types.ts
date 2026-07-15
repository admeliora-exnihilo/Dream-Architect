export type PageType = "dashboard" | "map" | "vault" | "emotion" | "builder";

export interface ActiveProtocol {
  id: string;
  name: string;
  status: "ACTIVE" | "STANDBY" | "OFFLINE";
  description: string;
}

export interface MemorySubject {
  id: string;
  name: string;
  issue: string;
  progress: number;
  eta: string;
  status: "REPAIRING" | "COMPLETED" | "CRITICAL";
}

export interface CustomDreamNode {
  id: string;
  label: string;
  type: "nightmare" | "lucid" | "anomaly" | "memory";
  depth: string;
  activity: number;
  x: number; // percentage coordinate 0-100
  y: number; // percentage coordinate 0-100
  description: string;
  stats: {
    depthVal: number;
    echoVal: number;
    driftVal: number;
  };
}

export interface EmotionalLandscape {
  fear: number;
  joy: number;
  trust: number;
  sadness: number;
  anger: number;
}

export interface BuiltDream {
  protocolName: string;
  frequency: string;
  stabilityRating: number;
  narrative: string;
  components: string[];
  riskFactor: string;
  theme?: string;
  setting?: string;
  companion?: string;
  mood?: string;
}
