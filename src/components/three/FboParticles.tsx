'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/lib/store';

// A simpler, highly performant particle system mimicking FBO complexity without the overhead of GPGPU setup for standard devices.
export default function FboParticles({ count = 250000 }) {
    const pointsRef = useRef<THREE.Points>(null);
    const progress = useScrollStore((state) => state.progress);

    // Generate initial particle positions
    const [positions, randomness] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const randomness = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Spawn particles in a massive volume
            positions[i * 3 + 0] = (Math.random() - 0.5) * 50; // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50; // z

            randomness[i * 3 + 0] = Math.random();
            randomness[i * 3 + 1] = Math.random();
            randomness[i * 3 + 2] = Math.random();
        }

        return [positions, randomness];
    }, [count]);

    const customMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uScroll: { value: 0 },
            },
            vertexShader: `
        uniform float uTime;
        uniform float uScroll;
        attribute vec3 randomness;

        varying float vAlpha;

        void main() {
          vec3 pos = position;

          // Flow upwards as we scroll down to give the illusion of falling
          pos.y += uScroll * 150.0;
          
          // Loop particles if they go too high
          pos.y = mod(pos.y + 25.0, 50.0) - 25.0;

          // Add chaotic turbulence
          pos.x += sin(uTime * randomness.x * 2.0 + pos.y * 0.1) * 0.5;
          pos.z += cos(uTime * randomness.y * 2.0 + pos.y * 0.1) * 0.5;

          // Distance from center (simulating the coin deflecting them)
          float dist = length(pos.xz);
          if (dist < 2.0) {
              pos.x += (pos.x / dist) * (2.0 - dist) * 1.5;
              pos.z += (pos.z / dist) * (2.0 - dist) * 1.5;
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Size attenuation
          gl_PointSize = (randomness.z * 4.0 + 1.0) * (10.0 / -mvPosition.z);

          // Fade out based on distance from center
          vAlpha = smoothstep(25.0, 0.0, length(pos));
        }
      `,
            fragmentShader: `
        varying float vAlpha;
        
        void main() {
          // Circular particle
          vec2 cxy = 2.0 * gl_PointCoord - 1.0;
          float r = dot(cxy, cxy);
          if (r > 1.0) discard;

          // Gold dust color
          vec3 color = vec3(1.0, 0.8, 0.3);
          
          // Fade edges of circle
          float alpha = vAlpha * (1.0 - r) * 0.5;

          gl_FragColor = vec4(color, alpha);
        }
      `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
    }, []);

    useFrame((state) => {
        if (pointsRef.current) {
            const material = pointsRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.elapsedTime;
            // Exponential smoothing for scroll to make it drift nice
            material.uniforms.uScroll.value += (progress - material.uniforms.uScroll.value) * 0.05;
        }
    });

    return (
        <points ref={pointsRef} material={customMaterial}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-randomness"
                    count={randomness.length / 3}
                    array={randomness}
                    itemSize={3}
                    args={[randomness, 3]}
                />
            </bufferGeometry>
        </points>
    );
}
