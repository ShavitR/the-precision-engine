'use client';

import { Physics, CuboidCollider } from '@react-three/rapier';
import { useEngineStore } from '@/lib/engineStore';

export default function PhysicsWorld({ children }: { children: React.ReactNode }) {
    const gravity = useEngineStore(state => state.gravity);

    return (
        <Physics gravity={gravity} timeStep="vary">
            {children}
            {/* Invisible walls to keep coin in viewport bounds */}
            <CuboidCollider position={[-5, 0, 0]} args={[1, 20, 5]} />
            <CuboidCollider position={[5, 0, 0]} args={[1, 20, 5]} />
        </Physics>
    );
}
