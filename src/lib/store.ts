import { create } from 'zustand';

interface ScrollState {
  progress: number;
  setProgress: (progress: number) => void;
  velocity: number;
  setVelocity: (velocity: number) => void;
  targetSection: number;
  setTargetSection: (section: number) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  setProgress: (progress) => set({ progress }),
  velocity: 0,
  setVelocity: (velocity) => set({ velocity }),
  targetSection: 0,
  setTargetSection: (targetSection) => set({ targetSection }),
}));
