export enum UserRole {
  ADMIN = 'ADMIN',
  ENGINEER = 'ENGINEER',
  VIEWER = 'VIEWER'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
}

export interface VibeEntry {
  id: string;
  title: string;
  description: string;
  prompt: string;
  builderUrl?: string;
  deployedUrl?: string;
  tags: string[];
  author: User;
  createdAt: number;
  updatedAt: number;
  version: number;
  likes: number;
  // AI Metadata
  aiSummary?: string;
  aiRating?: number; // 1-10 complexity score
}

export interface AnalysisResult {
  title: string;
  summary: string;
  tags: string[];
  complexityScore: number;
}

export type ViewState = 'DASHBOARD' | 'CREATE' | 'DETAIL' | 'PROFILE';