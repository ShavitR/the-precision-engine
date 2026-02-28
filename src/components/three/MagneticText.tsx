'use client';

import { useRef, useMemo } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/lib/store';

interface MagneticTextProps {
    text: string;
    position: [number, number, number];
    fontSize?: number;
    color?: string;
    maxWidth?: number;
    anchorX?: "left" | "center" | "right";
    anchorY?: "top" | "middle" | "bottom" | "baseline";
}

export function MagneticText({
    text,
    position,
    fontSize = 0.5,
    color = "white",
    maxWidth = 5,
    anchorX = "center",
    anchorY = "middle"
}: MagneticTextProps) {
    const textRef = useRef<any>(null);
    const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
    const targetPos = useMemo(() => new THREE.Vector3(...position), [position]);

    // Using a shared temp vector to avoid GC
    const coinWorldPos = useRef(new THREE.Vector3(0, 0, 0));

    useFrame((state, delta) => {
        if (!textRef.current) return;

        // In this implementation, we assume the coin is roughly centered on X/Z 
        // and its Y is driven by scroll progress. 
        // We'll get the coin's viewport position from the scroll progress for simplicity,
        // or we could look it up via a global ref if we had one.
        // Let's use the scroll progress to calculate where the coin is likely to be.

        const progress = useScrollStore.getState().progress;
        const viewportHeight = 20; // total vertical travel
        const coinY = 5 - (progress * viewportHeight);

        // Calculate distance between text and coin
        const distY = Math.abs(textRef.current.position.y - coinY);
        const distX = Math.abs(textRef.current.position.x - 0); // coin is at x=0

        const dist = Math.sqrt(distX * distX + distY * distY);
        const threshold = 3.0;

        if (dist < threshold) {
            // Repel logic
            const force = (1.0 - dist / threshold) * 1.5;
            const dirX = textRef.current.position.x > 0 ? 1 : -1;

            targetPos.x = initialPos.x + (dirX * force);
            targetPos.z = initialPos.z + force * 0.5;
        } else {
            targetPos.x = initialPos.x;
            targetPos.z = initialPos.z;
        }

        // Smooth interpolation
        textRef.current.position.x = THREE.MathUtils.lerp(textRef.current.position.x, targetPos.x, 0.1);
        textRef.current.position.z = THREE.MathUtils.lerp(textRef.current.position.z, targetPos.z, 0.1);

        // Subtle drift
        textRef.current.rotation.y = Math.sin(state.clock.elapsedTime + initialPos.y) * 0.05;
    });

    return (
        <Text
            ref={textRef}
            position={position}
            fontSize={fontSize}
            color={color}
            maxWidth={maxWidth}
            textAlign="center"
            anchorX={anchorX}
            anchorY={anchorY === "baseline" ? "top-baseline" : anchorY}
            letterSpacing={-0.05}
        >
            {text}
            <meshStandardMaterial
                emissive={color}
                emissiveIntensity={0.5}
                toneMapped={false}
                transparent
                opacity={0.8}
            />
        </Text>
    );
}
