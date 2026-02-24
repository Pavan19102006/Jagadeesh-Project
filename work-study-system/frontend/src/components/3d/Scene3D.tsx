import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import CosmicAuroraBackground from './CosmicAuroraBackground';
import ParticleField from './ParticleField';

// Slow, smooth mouse-reactive camera controls with parallax
const CameraController = () => {
    const { camera } = useThree();
    const targetPosition = useRef(new THREE.Vector3(0, 0, 10));
    const currentMouse = useRef(new THREE.Vector2(0, 0));

    useFrame((state) => {
        // Very smooth mouse following (slow and subtle)
        currentMouse.current.x += (state.mouse.x - currentMouse.current.x) * 0.02;
        currentMouse.current.y += (state.mouse.y - currentMouse.current.y) * 0.02;

        // Subtle depth-based parallax on mouse movement
        targetPosition.current.x = currentMouse.current.x * 1.0;
        targetPosition.current.y = currentMouse.current.y * 0.5;

        camera.position.x += (targetPosition.current.x - camera.position.x) * 0.015;
        camera.position.y += (targetPosition.current.y - camera.position.y) * 0.015;

        // Very subtle rotation for immersion
        camera.rotation.y = -currentMouse.current.x * 0.01;
        camera.rotation.x = currentMouse.current.y * 0.006;

        camera.lookAt(0, 0, 0);
    });

    return null;
};

// Loading fallback - subtle pulsing box
const LoadingFallback = () => (
    <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#0a0a1a" wireframe />
    </mesh>
);

interface Scene3DProps {
    className?: string;
}

const Scene3D = ({ className = '' }: Scene3DProps) => {
    return (
        <div className={`fixed inset-0 ${className}`} style={{ zIndex: -1 }}>
            <Canvas
                gl={{
                    antialias: false, // Disable for performance
                    alpha: false,
                    powerPreference: 'low-power', // Optimize for laptops
                    stencil: false,
                    depth: true,
                }}
                dpr={[0.5, 1]} // Lower resolution for performance
                camera={{ position: [0, 0, 10], fov: 55, near: 0.1, far: 200 }}
                frameloop="always"
                onCreated={({ gl }) => {
                    gl.toneMapping = THREE.ACESFilmicToneMapping;
                    gl.toneMappingExposure = 1.0;
                }}
            >
                <Suspense fallback={<LoadingFallback />}>
                    {/* New cosmic aurora background shader */}
                    <CosmicAuroraBackground />

                    {/* Subtle ambient lighting */}
                    <ambientLight intensity={0.3} />
                    <pointLight position={[5, 5, 5]} intensity={0.8} color="#00d4ff" />
                    <pointLight position={[-5, -3, -5]} intensity={0.5} color="#a855f7" />

                    {/* Reduced particle field for subtle activity indication */}
                    <ParticleField count={2000} radius={12} />

                    {/* Slow mouse-reactive camera */}
                    <CameraController />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Scene3D;
