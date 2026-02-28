'use client';
import { useRef, useEffect, useState } from 'react';
import { useScrollStore } from '@/lib/store';

interface ImageSequenceProps {
    frameCount?: number;
    folderPath?: string;
    filenamePrefix?: string;
    extension?: string;
}

export default function ImageSequence({
    frameCount = 120,
    folderPath = '/assets/sequence',
    filenamePrefix = 'frame_',
    extension = '.webp',
}: ImageSequenceProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { progress } = useScrollStore();
    const [images] = useState<HTMLImageElement[]>([]);
    const [loaded, setLoaded] = useState(false);

    // Preload images
    useEffect(() => {
        let imagesLoaded = 0;
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            const indexStr = i.toString().padStart(3, '0');
            img.src = `${folderPath}/${filenamePrefix}${indexStr}${extension}`;
            img.onload = () => {
                imagesLoaded++;
                if (imagesLoaded === frameCount) setLoaded(true);
            };
            images.push(img);
        }
    }, [frameCount, folderPath, filenamePrefix, extension, images]);

    // Render on scroll
    useEffect(() => {
        if (!loaded || !canvasRef.current || images.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Responsive canvas
        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        updateSize();
        window.addEventListener('resize', updateSize);

        return () => window.removeEventListener('resize', updateSize);
    }, [loaded, images]);

    useEffect(() => {
        if (!loaded || !canvasRef.current || images.length === 0) return;

        // Determine frame index from global scroll progress (0 to 1)
        // 0 progress = frame 0, 1 progress = frameCount - 1
        const frameIndex = Math.min(
            frameCount - 1,
            Math.max(0, Math.floor(progress * frameCount))
        );

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = images[frameIndex];
        if (img && img.complete) {
            // Draw image covering the canvas (object-fit: cover equivalent)
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width / 2) - (img.width / 2) * scale;
            const y = (canvas.height / 2) - (img.height / 2) * scale;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        }
    }, [progress, loaded, images, frameCount]);

    return (
        <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 bg-zinc-950">
            <canvas
                ref={canvasRef}
                className="w-full h-full object-cover opacity-80 mix-blend-screen"
            />
        </div>
    );
}
