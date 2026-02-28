'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollStore } from '@/lib/store';
import { Activity, Terminal, Crosshair, BarChart3, ShieldCheck } from 'lucide-react';

export function HUDOverlay() {
    const progress = useScrollStore(state => state.progress);
    const [time, setTime] = useState(new Date());
    const [fps, setFps] = useState(60);

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);

        let frameCount = 0;
        let lastTime = performance.now();
        const updateFps = () => {
            frameCount++;
            const now = performance.now();
            if (now - lastTime >= 1000) {
                setFps(frameCount);
                frameCount = 0;
                lastTime = now;
            }
            requestAnimationFrame(updateFps);
        };
        const animId = requestAnimationFrame(updateFps);

        return () => {
            clearInterval(interval);
            cancelAnimationFrame(animId);
        };
    }, []);

    const DataPoint = ({ label, value, color = "white" }: any) => (
        <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-none">{label}</span>
            <span className={`text-xs font-mono font-bold leading-none`} style={{ color }}>{value}</span>
        </div>
    );

    return (
        <>
            {/* Top Left: System Time & Status */}
            <div className="fixed top-24 left-10 z-50 pointer-events-none hidden lg:flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <motion.div
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                    />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black tracking-[0.3em] text-white">SYSTEM.AETHER</span>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase whitespace-nowrap">
                            {time.toLocaleTimeString()} // UTC+2
                        </span>
                    </div>
                </div>

                <div className="h-px w-24 bg-gradient-to-r from-white/20 to-transparent" />

                <div className="grid grid-cols-1 gap-4">
                    <DataPoint label="AETHER.FLOW" value="NOMINAL 0.94" color="#10b981" />
                    <DataPoint label="QUANTUM.SYNC" value="STABLE" color="#3b82f6" />
                    <DataPoint label="CACHE.DEPTH" value="4.2 PB" />
                </div>
            </div>

            {/* Bottom Left: Coordinates & Telemetry */}
            <div className="fixed bottom-10 left-10 z-50 pointer-events-none flex flex-col gap-4">
                <div className="bg-black/40 backdrop-blur-md border border-white/5 p-4 rounded-lg flex flex-col gap-4">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                        <Crosshair size={12} className="text-zinc-500" />
                        <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-400">Telemetry.Live</span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <DataPoint label="COORD.X" value={(Math.random() * 0.1).toFixed(4)} />
                        <DataPoint label="COORD.Y" value={(5 - progress * 20).toFixed(2)} />
                        <DataPoint label="VELOCITY" value={`${(progress * 150).toFixed(2)} m/s`} color="#fbbf24" />
                        <DataPoint label="DENSITY" value="0.992" />
                    </div>
                </div>

                <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest pl-1">
                    PRECISION_ENGINE // BUILD.2026.02
                </div>
            </div>

            {/* Bottom Right: Performance & Global State */}
            <div className="fixed bottom-10 right-10 z-50 pointer-events-none hidden lg:flex flex-col items-end gap-4">
                <div className="bg-black/40 backdrop-blur-md border border-white/5 p-4 rounded-lg flex flex-col items-end gap-3">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-mono text-zinc-500">FRAME_RATE</span>
                            <span className="text-xl font-black text-white tabular-nums">{fps}</span>
                        </div>
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center relative overflow-hidden">
                            <motion.div
                                className="absolute inset-0 bg-white/5"
                                animate={{ height: [0, 48, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                            />
                            <Activity size={18} className="text-white/40" />
                        </div>
                    </div>

                    <div className="w-full h-px bg-white/10" />

                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 grayscale opacity-50">
                            <ShieldCheck size={10} />
                            <span className="text-[8px] font-mono">TLS 3.0</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-400">
                            <Terminal size={10} />
                            <span className="text-[8px] font-mono whitespace-nowrap">NODE: v22.14.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
