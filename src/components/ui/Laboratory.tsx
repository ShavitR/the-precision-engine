'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEngineStore } from '@/lib/engineStore';
import { Settings, RefreshCw, ChevronRight, Zap, Flame, Move, Shield } from 'lucide-react';

export function Laboratory() {
    const [isOpen, setIsOpen] = useState(false);
    const store = useEngineStore();

    const ControlRow = ({ label, icon: Icon, value, min, max, step, onChange, unit = "" }: any) => (
        <div className="flex flex-col gap-2 mb-6">
            <div className="flex justify-between items-center text-[10px] font-mono tracking-widest uppercase">
                <div className="flex items-center gap-2 text-zinc-400">
                    <Icon size={12} className="text-zinc-500" />
                    <span>{label}</span>
                </div>
                <span className="text-white font-bold tabular-nums">{value}{unit}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-white hover:accent-zinc-300 transition-all"
            />
        </div>
    );

    return (
        <div className="fixed top-0 right-0 z-[100] h-full pointer-events-none">
            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 w-12 h-24 bg-white text-black flex flex-col items-center justify-center gap-4 pointer-events-auto border-y border-l border-zinc-200 shadow-2xl"
                whileHover={{ width: 60 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <Settings size={20} className={`${isOpen ? 'rotate-90' : ''} transition-transform duration-500`} />
                <span className="text-[8px] font-black uppercase [writing-mode:vertical-lr] tracking-widest">
                    The Laboratory
                </span>
            </motion.button>

            {/* Slide-out Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                        className="w-80 h-full bg-black/90 backdrop-blur-3xl border-l border-white/10 pointer-events-auto flex flex-col p-8 overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-12">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Engine.Parameters</h3>
                            <button
                                onClick={() => store.reset()}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-500 hover:text-white"
                                title="Reset to Defaults"
                            >
                                <RefreshCw size={16} />
                            </button>
                        </div>

                        <div className="space-y-8">
                            <section>
                                <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                                    <Move size={10} />
                                    <span>Dynamics</span>
                                </div>
                                <ControlRow
                                    label="Restitution"
                                    icon={Zap}
                                    value={store.restitution}
                                    min={0} max={1} step={0.01}
                                    onChange={store.setRestitution}
                                />
                                <ControlRow
                                    label="Friction"
                                    icon={Shield}
                                    value={store.friction}
                                    min={0} max={1} step={0.01}
                                    onChange={store.setFriction}
                                />
                                <ControlRow
                                    label="Object Mass"
                                    icon={Move}
                                    value={store.mass}
                                    min={0.1} max={20} step={0.1}
                                    onChange={store.setMass}
                                    unit="kg"
                                />
                            </section>

                            <section>
                                <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                                    <Flame size={10} />
                                    <span>Atmospheric</span>
                                </div>
                                <ControlRow
                                    label="Heat Sensitivity"
                                    icon={Flame}
                                    value={store.heatSensitivity}
                                    min={0} max={5} step={0.1}
                                    onChange={store.setHeatSensitivity}
                                />
                                <ControlRow
                                    label="Micro-Scratch Density"
                                    icon={Settings}
                                    value={store.scratchDensity}
                                    min={0} max={10} step={0.1}
                                    onChange={store.setScratchDensity}
                                />
                                <ControlRow
                                    label="Glitch Intensity"
                                    icon={Zap}
                                    value={store.glitchIntensity}
                                    min={0} max={1} step={0.01}
                                    onChange={store.setGlitchIntensity}
                                />
                            </section>
                        </div>

                        <div className="mt-auto pt-12 text-[8px] font-mono text-zinc-600 uppercase tracking-widest leading-relaxed">
                            <p className="mb-2">// SYSTEM OVERRIDE ACTIVE</p>
                            <p>// CHANGES APPLIED INSTANTANEOUSLY TO PHYSICS THREAD</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
