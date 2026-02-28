'use client';

import { useEffect, useRef } from 'react';
import Scene from '@/components/three/Scene';
import { useScrollStore } from '@/lib/store';
import { motion, useScroll } from 'framer-motion';
import { instance as audio } from '@/lib/AudioEngine';

import { GlobalNav } from '@/components/ui/navigation/GlobalNav';
import { TheMinting } from '@/components/ui/sections/TheMinting';
import { TheVault } from '@/components/ui/sections/TheVault';
import { TheExchange } from '@/components/ui/sections/TheExchange';
import { ThePedestal } from '@/components/ui/sections/ThePedestal';
import { HUDOverlay } from '@/components/ui/HUDOverlay';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress, setProgress, setVelocity } = useScrollStore();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (latest) => {
      setProgress(latest);
      const vel = scrollYProgress.getVelocity();
      setVelocity(vel);
      audio.update(latest, vel);
    });
    return () => unsub();
  }, [scrollYProgress, setProgress, setVelocity]);

  return (
    <main ref={containerRef} className="relative h-[600vh] bg-black text-white">
      {/* Central 3D Coin */}
      <Scene />

      {/* Global Navigation Engine */}
      <GlobalNav />

      {/* 
        EPIC SCROLLYTELLING JOURNEY 
        Each section acts as a massive collision floor and environment trigger 
      */}
      <div className="relative z-10 w-full flex flex-col">
        {/* Intro Spacing */}
        <section className="h-[100vh] flex items-center justify-center pointer-events-none">
          <h1 className="text-[10vw] font-black tracking-tighter text-white mix-blend-overlay opacity-20">
            THE ENGINE
          </h1>
        </section>

        {/* The Environments */}
        <TheMinting />
        <TheVault />
        <TheExchange />
        <ThePedestal />

        {/* Spacing for completion */}
        <div className="h-[50vh]" />
      </div>
      <section id="metrics" className="relative z-10 flex h-screen flex-col items-center justify-center pointer-events-none">
        <div className="text-center">
          <h2 className="text-[8vw] font-black mb-12 uppercase italic text-white/50">Elevate Status</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = "mailto:contact@precision.engine"}
            className="pointer-events-auto mt-8 relative group px-16 py-8 bg-transparent text-white border-2 border-white/20 text-3xl font-black uppercase tracking-tighter hover:bg-white hover:text-black hover:border-white transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] -z-10" />
            <span className="relative z-10 mixt-blend-difference">Initiate Contact</span>
          </motion.button>
        </div>
      </section>

      {/* 
        ADVANCED HUD & INTERACTIVE CONTROL 
      */}
      <HUDOverlay />

      <div className="fixed top-1/2 left-10 -translate-y-1/2 z-20 pointer-events-none hidden lg:block">
        <div className="w-1 h-32 bg-white/20">
          <motion.div
            style={{ height: progress * 100 + "%" }}
            className="w-full bg-white origin-top"
          />
        </div>
      </div>
    </main>
  );
}
