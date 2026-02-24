import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GradientBackground = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
            },
            vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        
        // Noise functions for Shadertoy-style effects
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m*m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        // Fractal Brownian Motion
        float fbm(vec2 p, int octaves) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 1.0;
          for (int i = 0; i < 6; i++) {
            if (i >= octaves) break;
            value += amplitude * snoise(p * frequency);
            frequency *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }
        
        void main() {
          vec2 uv = vUv;
          float t = uTime * 0.05;
          
          // Animated noise layers
          float n1 = fbm(uv * 2.5 + t * 0.3, 5);
          float n2 = fbm(uv * 3.5 - t * 0.2, 4);
          float n3 = fbm(uv * 2.0 + t * 0.15, 5);
          
          // Deep space color palette
          vec3 colorDeep = vec3(0.01, 0.005, 0.04);
          vec3 colorPurple = vec3(0.05, 0.02, 0.12);
          vec3 colorBlue = vec3(0.02, 0.08, 0.18);
          vec3 colorCyan = vec3(0.0, 0.2, 0.35);
          vec3 colorPink = vec3(0.15, 0.02, 0.1);
          
          // Blend colors based on noise
          float blend1 = smoothstep(-0.3, 0.8, n1 + uv.y * 0.5);
          float blend2 = smoothstep(0.0, 1.0, n2 * 0.8 + uv.x * 0.3);
          
          vec3 color = colorDeep;
          color = mix(color, colorPurple, blend1 * 0.7);
          color = mix(color, colorBlue, blend2 * 0.5);
          color = mix(color, colorCyan, n1 * 0.2);
          color += colorPink * n3 * 0.1;
          
          // Subtle nebula glow
          float glow = sin(uv.x * 8.0 + t * 2.0 + n1 * 4.0) * 0.5 + 0.5;
          glow *= smoothstep(0.4, 0.7, uv.y) * (1.0 - smoothstep(0.7, 1.0, uv.y));
          color += vec3(0.0, 0.3, 0.4) * glow * 0.05;
          
          // Stars
          float starNoise = snoise(uv * 150.0);
          float stars = step(0.985, starNoise);
          color += vec3(stars) * 0.5;
          
          // Vignette
          vec2 vignetteUv = uv * (1.0 - uv);
          float vignette = vignetteUv.x * vignetteUv.y * 20.0;
          vignette = pow(clamp(vignette, 0.0, 1.0), 0.5);
          color *= vignette;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
            side: THREE.BackSide,
            depthWrite: false,
        });
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh ref={meshRef} scale={[120, 120, 120]}>
            <sphereGeometry args={[1, 48, 48]} />
            <primitive object={shaderMaterial} attach="material" />
        </mesh>
    );
};

export default GradientBackground;
