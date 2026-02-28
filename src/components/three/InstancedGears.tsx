'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/lib/store';

export function InstancedGears() {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const count = 40;

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const gears = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                position: new THREE.Vector3(
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 40,
                    -5 - Math.random() * 5
                ),
                rotation: new THREE.Euler(0, 0, Math.random() * Math.PI * 2),
                speed: (Math.random() - 0.5) * 0.5,
                scale: 0.5 + Math.random() * 2
            });
        }
        return temp;
    }, []);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        const velocity = useScrollStore.getState().velocity || 0;

        gears.forEach((gear, i) => {
            const { position, rotation, speed, scale } = gear;

            // Rotate based on time + scroll velocity
            rotation.z += (speed + velocity * 0.1) * delta;

            dummy.position.copy(position);
            dummy.rotation.copy(rotation);
            dummy.scale.setScalar(scale);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
            <cylinderGeometry args={[1, 1, 0.2, 8]} />
            <meshStandardMaterial
                color="#222"
                metalness={0.9}
                roughness={0.1}
                emissive="#ffae00"
                emissiveIntensity={0.05}
            />
        </instancedMesh>
    );
}
