'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { useEngineStore } from '@/lib/engineStore';
import { useScrollStore } from '@/lib/store';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { CustomCoinMaterial } from './shaders/CoinMaterial';

export default function CentralCoin() {
    const rigidBodyRef = useRef<RapierRigidBody>(null);
    const meshRef = useRef<Mesh>(null);
    const progress = useScrollStore((state) => state.progress);
    const engine = useEngineStore();

    // Instantiate material once to avoid recreation on every render
    const customMaterial = useMemo(() => new CustomCoinMaterial({
        color: '#ffd700',
        metalness: 1.0,
        roughness: 0.15,
        clearcoat: 1.0,
    }), []);

    useFrame((state, delta) => {
        if (rigidBodyRef.current) {
            // Target Y drops down as progress goes from 0 to 1
            const startY = 2;
            const endY = -14;
            const targetY = startY + (endY - startY) * progress;

            const currentPos = rigidBodyRef.current.translation();

            // Apply spring force towards target Y, scaled by engine mass
            const forceY = (targetY - currentPos.y) * 10.0;

            // Add some base rotational torque and push
            rigidBodyRef.current.applyImpulse({ x: 0, y: forceY * delta, z: 0 }, true);

            // Add spin
            rigidBodyRef.current.applyTorqueImpulse({ x: delta * 0.1, y: delta * 0.2, z: 0 }, true);

            // Keep X and Z near 0 using springs
            const forceX = -currentPos.x * 2.0;
            const forceZ = -currentPos.z * 2.0;
            rigidBodyRef.current.applyImpulse({ x: forceX * delta, y: 0, z: forceZ * delta }, true);

            // Fetch current velocity to pass to shader
            const velocity = rigidBodyRef.current.linvel();
            const velocityMagnitude = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2);

            // Update custom shader uniforms with engine sensitivity
            if (customMaterial.userData.time) {
                customMaterial.userData.time.value = state.clock.elapsedTime;
                customMaterial.userData.velocity.value.set(velocity.x, velocity.y, velocity.z);
                // Increase heat based on velocity and engine sensitivity
                customMaterial.userData.heat.value = Math.max(0, velocityMagnitude * 0.05 * engine.heatSensitivity);
            }
        }
    });

    return (
        <RigidBody
            ref={rigidBodyRef}
            colliders="hull"
            restitution={engine.restitution}
            friction={engine.friction}
            mass={engine.mass}
            linearDamping={2.0}
            angularDamping={0.5}
            position={[0, 5, 0]}
        >
            <mesh ref={meshRef} castShadow receiveShadow material={customMaterial}>
                <cylinderGeometry args={[1.5, 1.5, 0.2, 64]} />
            </mesh>
        </RigidBody>
    );
}
