'use client';

import { useRef, useState, useEffect } from 'react';
import { useInView, motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useScrollStore } from '@/lib/store';

const stagger = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
};

const fadeUp = {
    hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: 'easeOut' as const } }
};

const metrics = [
    { label: 'YIELD PURITY', value: 99.97, suffix: '%', color: 'amber' },
    { label: 'MOLECULAR PRECISION', value: 0.003, suffix: 'nm', color: 'amber' },
    { label: 'ATOMIC LATENCY', value: 12, suffix: 'ps', color: 'amber' },
    { label: 'THERMAL FLUX', value: 1847, suffix: '°C', color: 'red' },
];

function AnimatedCounter({ value, suffix, duration = 2 }: { value: number; suffix: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const step = value / (duration * 60);
        const interval = setInterval(() => {
            start += step;
            if (start >= value) { setCount(value); clearInterval(interval); }
            else setCount(start);
        }, 1000 / 60);
        return () => clearInterval(interval);
    }, [isInView, value, duration]);

    const display = value < 1 ? count.toFixed(3) : Math.floor(count).toLocaleString();
    return <span ref={ref} className="tabular-nums">{display}{suffix}</span>;
}

export function TheMinting() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { margin: "-30% 0px -30% 0px" });
    const progress = useScrollStore(state => state.progress);

    // Mouse-reactive glow
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const glowX = useSpring(mouseX, { damping: 25, stiffness: 200 });
    const glowY = useSpring(mouseY, { damping: 25, stiffness: 200 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    return (
        <section
            id="minting"
            ref={sectionRef}
            className="relative min-h-[200vh] w-full flex items-center justify-center pointer-events-none overflow-hidden"
            onMouseMove={handleMouseMove}
        >
            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
            }} />

            {/* Mouse-reactive radial glow */}
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{
                    x: glowX, y: glowY,
                    background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
                    transform: 'translate(-50%, -50%)',
                }}
            />

            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-10">
                <motion.div
                    className="flex flex-col justify-center"
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-20%" }}
                >
                    <motion.span variants={fadeUp} className="text-xs font-mono text-amber-500/60 tracking-[0.5em] uppercase mb-4">
                        {'PHASE.01 // THE FORGE'}
                    </motion.span>

                    <motion.h2 variants={fadeUp} className="text-7xl lg:text-8xl font-black tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-800 leading-[0.9]">
                        FORGED IN<br />SILICON.
                    </motion.h2>

                    <motion.p variants={fadeUp} className="text-xl text-amber-200/50 font-mono leading-relaxed max-w-lg mb-12">
                        Raw thermodynamic forces shape the underlying logic. The transition from chaotic entropy to ordered, immutable state. Every atom calibrated to sub-nanometer precision.
                    </motion.p>

                    {/* Metrics Grid */}
                    <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 max-w-lg pointer-events-auto">
                        {metrics.map((m, i) => (
                            <motion.div
                                key={m.label}
                                className="border border-amber-500/10 bg-amber-950/20 backdrop-blur-sm p-4 rounded-xl group hover:border-amber-500/40 hover:bg-amber-900/20 transition-all duration-500 cursor-default"
                                whileHover={{ scale: 1.02, y: -2 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <span className="text-[10px] text-amber-400/50 font-mono uppercase tracking-[0.3em] block mb-1">
                                    {m.label}
                                </span>
                                <span className="text-2xl font-black text-white font-mono block group-hover:text-amber-300 transition-colors">
                                    <AnimatedCounter value={m.value} suffix={m.suffix} />
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Heat Signature Bar */}
                    <motion.div variants={fadeUp} className="mt-8 max-w-lg">
                        <div className="flex justify-between text-[10px] font-mono text-amber-400/40 uppercase tracking-widest mb-2">
                            <span>Heat Signature</span>
                            <span>{Math.floor(progress * 1500 + 300)}°C</span>
                        </div>
                        <div className="h-1 bg-amber-900/30 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{
                                    width: `${Math.min(100, progress * 150)}%`,
                                    background: `linear-gradient(90deg, #f59e0b, #ef4444)`,
                                    boxShadow: '0 0 20px rgba(245,158,11,0.5)',
                                }}
                                transition={{ type: 'spring', stiffness: 100 }}
                            />
                        </div>
                    </motion.div>
                </motion.div>

                <div className="col-span-1" /> {/* Space for coin */}
            </div>

            {/* Decorative corner marks */}
            <AnimatePresence>
                {isInView && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} exit={{ opacity: 0 }} className="absolute top-20 left-20 w-12 h-12 border-t border-l border-amber-500/50" />
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} exit={{ opacity: 0 }} className="absolute bottom-20 right-20 w-12 h-12 border-b border-r border-amber-500/50" />
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
