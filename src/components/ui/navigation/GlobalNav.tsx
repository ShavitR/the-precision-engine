'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

import { instance as audio } from '@/lib/AudioEngine';

const navItems = [
    { label: 'THE MINTING', id: 'minting' },
    { label: 'THE VAULT', id: 'vault' },
    { label: 'THE EXCHANGE', id: 'exchange' },
    { label: 'METRICS', id: 'metrics' }
];

function AudioToggle() {
    const [isPlaying, setIsPlaying] = useState(false);

    const toggleAudio = () => {
        const status = audio.toggle();
        setIsPlaying(status);
    };

    return (
        <button
            onClick={toggleAudio}
            className="flex items-center gap-2 pointer-events-auto px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/10 transition-colors"
        >
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs font-mono font-bold tracking-widest text-zinc-300">
                {isPlaying ? 'AUDIO ON' : 'AUDIO OFF'}
            </span>
        </button>
    );
}

function MagneticLink({ children, targetId }: { children: React.ReactNode, targetId: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        mouseX.set((e.clientX - centerX) * 0.5); // Pull strength
        mouseY.set((e.clientY - centerY) * 0.5);
    };

    const handleClick = () => {
        const el = document.getElementById(targetId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <motion.div
            ref={ref}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                mouseX.set(0);
                mouseY.set(0);
            }}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            style={{ x, y }}
            className="relative cursor-pointer px-4 py-2"
        >
            <span className="relative z-10 text-sm font-mono text-zinc-300 tracking-widest mix-blend-difference">
                {children}
            </span>
            {isHovered && (
                <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 z-0 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                />
            )}
        </motion.div>
    );
}

export function GlobalNav() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-12 py-6 mix-blend-difference pointer-events-none">
            <div className="flex gap-4 items-center">
                <div className="text-xl font-bold tracking-tighter text-white pointer-events-auto flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="w-4 h-4 rounded-full bg-amber-500 animate-pulse" />
                    PRECISION<span className="text-amber-500">.</span>
                </div>
                <AudioToggle />
            </div>

            <nav className="flex space-x-2 pointer-events-auto bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full px-2 py-1 shadow-2xl shadow-amber-500/10">
                {navItems.map(item => (
                    <MagneticLink key={item.id} targetId={item.id}>{item.label}</MagneticLink>
                ))}
            </nav>
        </header>
    );
}
