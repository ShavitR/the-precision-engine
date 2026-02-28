'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import CentralCoin from './CentralCoin';
import PhysicsWorld from './systems/PhysicsWorld';
import FboParticles from './FboParticles';
import CameraController from './CameraController';
import { InstancedGears } from './InstancedGears';

export default function Scene() {
    return (
        <div className="fixed inset-0 z-0 bg-transparent">
            <Canvas shadows gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
                <CameraController />
                <Suspense fallback={null}>
                    <Environment preset="night" />
                    <ambientLight intensity={0.2} />
                    <spotLight
                        position={[10, 10, 10]}
                        angle={0.15}
                        penumbra={1}
                        intensity={1}
                        castShadow
                    />

                    <PhysicsWorld>
                        <CentralCoin />

                        <InstancedGears />
                    </PhysicsWorld>

                    <FboParticles />
                </Suspense>
            </Canvas>
        </div>
    );
}
