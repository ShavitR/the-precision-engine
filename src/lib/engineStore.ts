'use client';

import { create } from 'zustand';

interface EngineState {
    // Physics
    gravity: [number, number, number];
    restitution: number;
    friction: number;
    mass: number;

    // Shader / Visuals
    heatSensitivity: number;
    scratchDensity: number;
    glitchIntensity: number;
    particleCount: number;

    // Actions
    setGravity: (g: [number, number, number]) => void;
    setRestitution: (r: number) => void;
    setFriction: (f: number) => void;
    setMass: (m: number) => void;
    setHeatSensitivity: (s: number) => void;
    setScratchDensity: (d: number) => void;
    setGlitchIntensity: (i: number) => void;
    reset: () => void;
}

const initialState = {
    gravity: [0, -9.81, 0] as [number, number, number],
    restitution: 0.8,
    friction: 0.2,
    mass: 5,
    heatSensitivity: 1.0,
    scratchDensity: 1.0,
    glitchIntensity: 0.2,
    particleCount: 250000,
};

export const useEngineStore = create<EngineState>((set) => ({
    ...initialState,

    setGravity: (gravity) => set({ gravity }),
    setRestitution: (restitution) => set({ restitution }),
    setFriction: (friction) => set({ friction }),
    setMass: (mass) => set({ mass }),
    setHeatSensitivity: (heatSensitivity) => set({ heatSensitivity }),
    setScratchDensity: (scratchDensity) => set({ scratchDensity }),
    setGlitchIntensity: (glitchIntensity) => set({ glitchIntensity }),

    reset: () => set(initialState),
}));
