'use client';

export default function SketchfabEmbed() {
    return (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/20 bg-zinc-900 shadow-2xl group transition-all hover:border-white/40">
            <div className="sketchfab-embed-wrapper h-full w-full">
                <iframe
                    title="Mechanical Wristwatch (Rigged + Animated)"
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    src="https://sketchfab.com/models/cb91b747e15d48198bb2383fc2e84b3b/embed"
                />
            </div>
            <div className="absolute bottom-4 left-4 p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded font-mono text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                ASSET.SOURCE // SKETCHFAB_V1
            </div>
        </div>
    );
}
