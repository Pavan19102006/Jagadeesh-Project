import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
    count?: number;
    radius?: number;
}

const ParticleField = ({ count = 2000, radius = 12 }: ParticleFieldProps) => {
    const mesh = useRef<THREE.Points>(null);

    // Generate particle positions with subtle distribution
    const [positions, scales, colors] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const scales = new Float32Array(count);
        const colors = new Float32Array(count * 3);

        // Professional color palette - cyan, white, subtle purple
        const color1 = new THREE.Color('#00d4ff'); // Cyan
        const color2 = new THREE.Color('#ffffff'); // White
        const color3 = new THREE.Color('#a855f7'); // Purple
        const color4 = new THREE.Color('#60a5fa'); // Light blue

        for (let i = 0; i < count; i++) {
            // Spherical distribution with clustering
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const r = Math.pow(Math.random(), 0.6) * radius;

            const scatter = Math.random() * 1.0;

            const x = r * Math.sin(phi) * Math.cos(theta) + (Math.random() - 0.5) * scatter;
            const y = r * Math.sin(phi) * Math.sin(theta) * 0.3 + (Math.random() - 0.5) * scatter * 0.2;
            const z = r * Math.cos(phi) + (Math.random() - 0.5) * scatter;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z - 3.0; // Push back in scene

            // Size variation - smaller for subtlety
            scales[i] = Math.random() * 0.5 + 0.2;

            // Color blend - predominantly cyan and white
            const t = Math.random();
            let particleColor;
            if (t < 0.4) {
                particleColor = color1.clone().lerp(color2, t * 2.5);
            } else if (t < 0.7) {
                particleColor = color2.clone().lerp(color4, (t - 0.4) * 3.33);
            } else {
                particleColor = color4.clone().lerp(color3, (t - 0.7) * 3.33);
            }

            colors[i * 3] = particleColor.r;
            colors[i * 3 + 1] = particleColor.g;
            colors[i * 3 + 2] = particleColor.b;
        }

        return [positions, scales, colors];
    }, [count, radius]);

    // Custom shader material for particles with subtle glow
    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) },
            },
            vertexShader: `
                uniform float uTime;
                uniform float uPixelRatio;
                
                attribute float aScale;
                attribute vec3 aColor;
                
                varying vec3 vColor;
                varying float vAlpha;
                
                void main() {
                    vec3 pos = position;
                    
                    // Very gentle wave animation (slow)
                    float wave = sin(pos.x * 0.2 + uTime * 0.15) * cos(pos.z * 0.15 + uTime * 0.1);
                    pos.y += wave * 0.1;
                    
                    // Very slow rotation
                    float angle = uTime * 0.02;
                    float cosA = cos(angle);
                    float sinA = sin(angle);
                    vec3 rotatedPos = vec3(
                        pos.x * cosA - pos.z * sinA,
                        pos.y,
                        pos.x * sinA + pos.z * cosA
                    );
                    
                    vec4 modelPosition = modelMatrix * vec4(rotatedPos, 1.0);
                    vec4 viewPosition = viewMatrix * modelPosition;
                    vec4 projectedPosition = projectionMatrix * viewPosition;
                    
                    gl_Position = projectedPosition;
                    
                    // Size attenuation
                    float sizeAttenuation = 1.0 / -viewPosition.z;
                    gl_PointSize = aScale * 40.0 * uPixelRatio * sizeAttenuation;
                    gl_PointSize = clamp(gl_PointSize, 0.5, 12.0);
                    
                    vColor = aColor;
                    vAlpha = smoothstep(20.0, 4.0, -viewPosition.z) * 0.6;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vAlpha;
                
                void main() {
                    vec2 center = gl_PointCoord - vec2(0.5);
                    float dist = length(center);
                    
                    if (dist > 0.5) discard;
                    
                    // Smooth circular falloff
                    float brightness = 1.0 - smoothstep(0.0, 0.5, dist);
                    brightness = pow(brightness, 1.8);
                    
                    // Subtle glow effect
                    float glow = 1.0 - smoothstep(0.0, 0.35, dist);
                    
                    vec3 color = vColor * brightness;
                    color += vColor * glow * 0.2;
                    
                    float alpha = brightness * vAlpha;
                    
                    gl_FragColor = vec4(color, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
    }, []);

    useFrame((state) => {
        if (!mesh.current) return;
        shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    });

    return (
        <points ref={mesh} material={shaderMaterial}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
                <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
            </bufferGeometry>
        </points>
    );
};

export default ParticleField;
