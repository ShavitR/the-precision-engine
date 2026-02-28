'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useScrollStore } from '@/lib/store';
import * as THREE from 'three';

export default function CameraController() {
    const { camera } = useThree();
    const progress = useScrollStore((state) => state.progress);

    useFrame(() => {
        // Slow cinematic zoom out as we scroll
        const startZ = 4;
        const endZ = 6;
        const targetZ = startZ + (endZ - startZ) * progress;

        // Slightly look down at the end
        const targetY = progress * -1;

        const targetPos = new THREE.Vector3(0, 0, targetZ);
        camera.position.lerp(targetPos, 0.05);

        const lookAtTarget = new THREE.Vector3(0, targetY, 0);

        const tempTarget = new THREE.Vector3();
        tempTarget.copy(camera.userData.lookTarget || lookAtTarget);
        tempTarget.lerp(lookAtTarget, 0.05);
        camera.userData.lookTarget = tempTarget;

        camera.lookAt(tempTarget);
    });

    return null;
}
