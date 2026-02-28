'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Trophy, ArrowRight, Github, Twitter, Layers } from 'lucide-react';

export function ThePedestal() {
    const { ref, inView } = useInView({ threshold: 0.3 });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: 'easeOut' as const } }
    };

    return (
        <section id="pedestal" ref={ref} className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-black to-zinc-900/50 py-32 px-10">
            {/* Background Glow */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: inView ? [0.1, 0.2, 0.1] : 0
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100vw] h-[100vw] bg-emerald-500/10 blur-[150px] rounded-full"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center"
            >
                <motion.div variants={itemVariants} className="mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
                        <Trophy size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Milestone Reached</span>
                    </div>
                    <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-none">
                        THE.FINAL.STATE
                    </h2>
                </motion.div>

                <motion.p variants={itemVariants} className="max-w-2xl text-xl text-zinc-400 font-medium leading-relaxed mb-16">
                    A culmination of molecular precision and digital craftsmanship. The engine has stabilized. The vision is complete.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6 mb-24">
                    <button className="px-10 py-5 bg-white text-black font-black uppercase italic tracking-tighter text-lg hover:bg-emerald-400 transition-all flex items-center gap-3 active:scale-95">
                        BUILD_YOUR_ENGINE <ArrowRight size={20} />
                    </button>
                    <button className="px-10 py-5 bg-transparent border border-white/20 text-white font-black uppercase italic tracking-tighter text-lg hover:bg-white/10 transition-all active:scale-95">
                        VIEW_ARCHIVE
                    </button>
                </motion.div>

                {/* Interactive Footer Map */}
                <motion.div variants={itemVariants} className="w-full grid grid-cols-1 md:grid-cols-4 gap-12 text-left pt-24 border-t border-white/5">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-white rounded-sm" />
                            <span className="text-lg font-black uppercase italic tracking-tighter text-white">Precision.</span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px]">
                            Crafting modular extremes for the next era of digital interaction. Built with passion and cold-rolled steel.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Infrastructure</span>
                        <a href="#" className="text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-widest font-bold">The Forge</a>
                        <a href="#" className="text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-widest font-bold">The Vault</a>
                        <a href="#" className="text-xs text-zinc-400 hover:text-white transition-colors uppercase tracking-widest font-bold">The Exchange</a>
                    </div>

                    <div className="flex flex-col gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Connect</span>
                        <div className="flex items-center gap-4">
                            <Github size={18} className="text-zinc-500 hover:text-white cursor-pointer transition-colors" />
                            <Twitter size={18} className="text-zinc-500 hover:text-white cursor-pointer transition-colors" />
                            <Layers size={18} className="text-zinc-500 hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Newsletter</span>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="AETHER_ID@PRECISION.IO"
                                className="w-full bg-zinc-900 border border-white/10 p-3 text-[10px] font-mono text-white focus:border-white/40 transition-all outline-none"
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-24 text-[9px] font-mono text-zinc-700 uppercase tracking-[0.5em]">
                    &copy; 2026 PRECISION_ENGINE // ALL_RIGHTS_RESERVED // SYSTEM_AETHER_V4
                </motion.div>
            </motion.div>

            {/* Scanning Line */}
            <motion.div
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[1px] bg-emerald-500/10 z-20 pointer-events-none"
            />
        </section>
    );
}
