'use client';

import { useRef, useState, useEffect } from 'react';
import { useInView, motion, AnimatePresence } from 'framer-motion';
import { useScrollStore } from '@/lib/store';

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
};

const fadeRight = {
    hidden: { opacity: 0, x: 80, filter: 'blur(10px)' },
    visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: 'easeOut' as const } }
};

const securityLayers = [
    { protocol: 'AES-256-GCM', status: 'ACTIVE', latency: '0.3ms' },
    { protocol: 'SHA-3 KECCAK', status: 'VERIFIED', latency: '0.1ms' },
    { protocol: 'ED25519', status: 'SIGNED', latency: '0.2ms' },
    { protocol: 'ECDH-P384', status: 'SEALED', latency: '0.4ms' },
    { protocol: 'ARGON2ID', status: 'HARDENED', latency: '1.2ms' },
];

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
    const [displayed, setDisplayed] = useState('');
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        let i = 0;
        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                setDisplayed(text.slice(0, i + 1));
                i++;
                if (i >= text.length) clearInterval(interval);
            }, 40);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timeout);
    }, [isInView, text, delay]);

    return <span ref={ref}>{displayed}<span className="animate-pulse">_</span></span>;
}

export function TheVault() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { margin: "-30% 0px -30% 0px" });
    const progress = useScrollStore(state => state.progress);

    return (
        <section
            id="vault"
            ref={sectionRef}
            className="relative min-h-[200vh] w-full flex items-center justify-center pointer-events-none overflow-hidden"
        >
            {/* Hexagonal grid background */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3e%3cg fill-rule='evenodd'%3e%3cg fill='%2359a5ff' fill-opacity='1'%3e%3cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
            }} />

            {/* Frost radial overlay */}
            <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.03) 0%, transparent 70%)',
            }} />

            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-10">
                <div className="col-span-1" /> {/* Space for coin */}

                <motion.div
                    className="flex flex-col justify-center"
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-20%" }}
                >
                    <motion.span variants={fadeRight} className="text-xs font-mono text-blue-500/60 tracking-[0.5em] uppercase mb-4">
                        {'PHASE.02 // COLD STORAGE'}
                    </motion.span>

                    <motion.h2 variants={fadeRight} className="text-7xl lg:text-8xl font-black tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-blue-200 via-blue-400 to-blue-900 leading-[0.9]">
                        CRYPTOGRAPHIC<br />FINALITY.
                    </motion.h2>

                    <motion.p variants={fadeRight} className="text-xl text-blue-200/40 font-mono leading-relaxed max-w-lg mb-10">
                        Zero-knowledge proofs. Cold storage matrices. When the protocol commits, it is absolute. The physics engine mirrors this weight.
                    </motion.p>

                    {/* Security Protocol Table */}
                    <motion.div variants={fadeRight} className="max-w-lg pointer-events-auto">
                        <div className="text-[10px] font-mono text-blue-400/30 uppercase tracking-[0.3em] mb-3 grid grid-cols-3 px-4">
                            <span>Protocol</span>
                            <span>Status</span>
                            <span className="text-right">Latency</span>
                        </div>
                        <div className="space-y-1">
                            {securityLayers.map((layer, i) => (
                                <motion.div
                                    key={layer.protocol}
                                    initial={{ opacity: 0, x: 40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    viewport={{ once: true }}
                                    className="grid grid-cols-3 items-center px-4 py-3 rounded-lg bg-blue-950/20 border border-blue-500/5 hover:border-blue-500/30 hover:bg-blue-900/20 transition-all duration-300 cursor-default group"
                                >
                                    <span className="text-sm font-mono text-blue-300/80 group-hover:text-blue-200 transition-colors">{layer.protocol}</span>
                                    <span className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${layer.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`} />
                                        <span className="text-xs font-mono text-blue-400/60">{layer.status}</span>
                                    </span>
                                    <span className="text-sm font-mono text-blue-300/50 text-right">{layer.latency}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Encryption Depth Indicator */}
                    <motion.div variants={fadeRight} className="mt-8 max-w-lg">
                        <div className="border border-blue-500/10 bg-blue-950/20 backdrop-blur-sm p-5 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full border-2 border-blue-400/50 flex items-center justify-center relative overflow-hidden bg-black/50 shrink-0">
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400"
                                        animate={{ height: `${Math.max(5, Math.min(100, (progress - 0.2) * 200))}%` }}
                                        transition={{ type: 'spring', stiffness: 80 }}
                                        style={{ boxShadow: '0 0 15px rgba(59,130,246,0.6)' }}
                                    />
                                    <span className="relative z-10 text-xs font-mono font-bold text-white">{(progress * 100).toFixed(0)}%</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-blue-400/50 font-mono uppercase tracking-[0.3em]">Vault Integrity</span>
                                    <span className="text-lg font-black text-white font-mono">
                                        <TypewriterText text="QUANTUM-RESISTANT" delay={500} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scan lines effect */}
            <AnimatePresence>
                {isInView && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.03 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, rgba(59,130,246,0.15) 0px, transparent 1px, transparent 3px)',
                            backgroundSize: '100% 3px',
                        }}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}
