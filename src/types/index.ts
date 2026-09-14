export * from "./database.types";

// Domain & View-Model Types
export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface ResearchIndicator {
  label: string;
  value: string;
  unit?: string;
  description: string;
}

export interface ScientificNetworkNode {
  id: string;
  label: string;
  category: "environment" | "contaminant" | "exposure" | "response" | "health" | "impact";
  description: string;
  x?: number;
  y?: number;
}

export interface ScientificNetworkEdge {
  source: string;
  target: string;
  label?: string;
}
