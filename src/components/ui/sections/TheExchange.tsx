'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useInView, motion, AnimatePresence } from 'framer-motion';
import { useScrollStore } from '@/lib/store';

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const fadeUp = {
    hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: 'easeOut' as const } }
};

function LiveTicker() {
    const [txs, setTxs] = useState<{ hash: string; amount: string; time: string }[]>([]);

    useEffect(() => {
        const addTx = () => {
            const hash = '0x' + Math.random().toString(16).slice(2, 14);
            const amount = (Math.random() * 50 + 0.001).toFixed(4);
            const time = new Date().toLocaleTimeString();
            setTxs(prev => [{ hash, amount, time }, ...prev.slice(0, 5)]);
        };
        addTx();
        const interval = setInterval(addTx, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-1.5 max-w-md">
            <AnimatePresence mode="popLayout">
                {txs.map((tx) => (
                    <motion.div
                        key={tx.hash}
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-green-950/20 border border-green-500/5 font-mono text-xs"
                    >
                        <span className="text-green-400/60 truncate w-32">{tx.hash}</span>
                        <span className="text-green-300/80 font-bold">{tx.amount} ETH</span>
                        <span className="text-green-500/40">{tx.time}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

function SparklineChart() {
    const [points, setPoints] = useState<number[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const generatePoints = useCallback(() => {
        const arr: number[] = [];
        let val = 50;
        for (let i = 0; i < 60; i++) {
            val += (Math.random() - 0.48) * 8;
            val = Math.max(10, Math.min(90, val));
            arr.push(val);
        }
        return arr;
    }, []);

    useEffect(() => {
        setPoints(generatePoints());
        const interval = setInterval(() => setPoints(generatePoints()), 3000);
        return () => clearInterval(interval);
    }, [generatePoints]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || points.length === 0) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // Gradient fill
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, 'rgba(34,197,94,0.15)');
        grad.addColorStop(1, 'rgba(34,197,94,0)');

        ctx.beginPath();
        ctx.moveTo(0, h);
        points.forEach((p, i) => {
            ctx.lineTo((i / (points.length - 1)) * w, h - (p / 100) * h);
        });
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Line
        ctx.beginPath();
        points.forEach((p, i) => {
            const x = (i / (points.length - 1)) * w;
            const y = h - (p / 100) * h;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Glow dot at end
        const lastX = w;
        const lastY = h - (points[points.length - 1] / 100) * h;
        ctx.beginPath();
        ctx.arc(lastX - 2, lastY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#22c55e';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(lastX - 2, lastY, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34,197,94,0.3)';
        ctx.fill();
    }, [points]);

    return <canvas ref={canvasRef} width={400} height={100} className="w-full h-24 rounded-lg" />;
}

export function TheExchange() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { margin: "-30% 0px -30% 0px" });
    const progress = useScrollStore(state => state.progress);

    return (
        <section
            id="exchange"
            ref={sectionRef}
            className="relative min-h-[200vh] w-full flex items-center justify-center pointer-events-none overflow-hidden"
        >
            {/* Matrix rain background */}
            <div className="absolute inset-0 opacity-[0.015]" style={{
                backgroundImage: 'linear-gradient(rgba(34,197,94,0.6) 1px, transparent 1px)',
                backgroundSize: '100% 4px',
            }} />

            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-10">
                <motion.div
                    className="flex flex-col justify-center"
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-20%" }}
                >
                    <motion.span variants={fadeUp} className="text-xs font-mono text-green-500/60 tracking-[0.5em] uppercase mb-4">
                        {'PHASE.03 // VELOCITY'}
                    </motion.span>

                    <motion.h2 variants={fadeUp} className="text-7xl lg:text-8xl font-black tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-green-200 via-green-400 to-green-900 leading-[0.9]">
                        HIGH-FREQUENCY<br />VELOCITY.
                    </motion.h2>

                    <motion.p variants={fadeUp} className="text-xl text-green-200/40 font-mono leading-relaxed max-w-lg mb-10">
                        Execution at the edge of network capabilities. Millions of transactions verified, resolved, and embedded instantaneously.
                    </motion.p>

                    {/* Live Sparkline */}
                    <motion.div variants={fadeUp} className="max-w-md mb-6 pointer-events-auto">
                        <div className="border border-green-500/10 bg-green-950/10 backdrop-blur-sm p-4 rounded-xl">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-mono text-green-400/50 uppercase tracking-[0.3em]">Market Activity</span>
                                <span className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] font-mono text-green-500/70">LIVE</span>
                                </span>
                            </div>
                            <SparklineChart />
                        </div>
                    </motion.div>

                    {/* Live Transaction Feed */}
                    <motion.div variants={fadeUp} className="pointer-events-auto">
                        <div className="text-[10px] font-mono text-green-400/30 uppercase tracking-[0.3em] mb-2">
                            Recent Transactions
                        </div>
                        <LiveTicker />
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div variants={fadeUp} className="flex gap-6 mt-8 pointer-events-auto">
                        {[
                            { label: 'TPS', value: Math.floor(progress * 900000 + 100000).toLocaleString() },
                            { label: 'BLOCK', value: `#${Math.floor(progress * 900000 + 1000000).toLocaleString()}` },
                            { label: 'GAS', value: `${(Math.random() * 20 + 5).toFixed(1)} gwei` },
                        ].map(stat => (
                            <div key={stat.label} className="text-center">
                                <div className="text-[10px] font-mono text-green-400/40 uppercase tracking-widest">{stat.label}</div>
                                <div className="text-lg font-black font-mono text-green-300/80 tabular-nums">{stat.value}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                <div className="col-span-1" /> {/* Space for coin */}
            </div>

            {/* Scan line overlay */}
            <AnimatePresence>
                {isInView && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.02 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, rgba(34,197,94,0.2) 0px, transparent 1px, transparent 4px)',
                            backgroundSize: '100% 4px',
                        }}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}
