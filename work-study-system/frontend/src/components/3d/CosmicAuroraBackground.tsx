import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * CosmicAuroraBackground - A stunning WebGL shader background featuring
 * flowing aurora borealis waves, twinkling constellation stars,
 * glowing orbs, and smooth light ribbons.
 */
const CosmicAuroraBackground = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { size } = useThree();

    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2(size.width, size.height) },
                uMouse: { value: new THREE.Vector2(0.5, 0.5) },
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
                uniform vec2 uResolution;
                uniform vec2 uMouse;
                varying vec2 vUv;
                
                // Aurora color palette
                #define COL_DEEP_SPACE vec3(0.01, 0.01, 0.04)
                #define COL_AURORA_GREEN vec3(0.2, 0.95, 0.5)
                #define COL_AURORA_CYAN vec3(0.1, 0.85, 0.95)
                #define COL_AURORA_PURPLE vec3(0.6, 0.2, 0.9)
                #define COL_AURORA_PINK vec3(0.95, 0.3, 0.7)
                #define COL_STAR_WHITE vec3(1.0, 0.98, 0.95)
                #define COL_ORB_GLOW vec3(0.4, 0.7, 1.0)
                
                // Hash functions for randomness
                float hash(vec2 p) {
                    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
                }
                
                float hash3(vec3 p) {
                    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
                }
                
                // Smooth noise
                float noise(vec2 p) {
                    vec2 i = floor(p);
                    vec2 f = fract(p);
                    f = f * f * (3.0 - 2.0 * f);
                    
                    float a = hash(i);
                    float b = hash(i + vec2(1.0, 0.0));
                    float c = hash(i + vec2(0.0, 1.0));
                    float d = hash(i + vec2(1.0, 1.0));
                    
                    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
                }
                
                // Fractal Brownian Motion
                float fbm(vec2 p) {
                    float value = 0.0;
                    float amplitude = 0.5;
                    float frequency = 1.0;
                    for(int i = 0; i < 5; i++) {
                        value += amplitude * noise(p * frequency);
                        amplitude *= 0.5;
                        frequency *= 2.0;
                    }
                    return value;
                }
                
                // Aurora wave function
                float aurora(vec2 uv, float time, float offset) {
                    float t = time * 0.3 + offset;
                    
                    // Layer multiple waves
                    float wave1 = sin(uv.x * 3.0 + t * 0.7 + offset * 2.0) * 0.15;
                    float wave2 = sin(uv.x * 5.0 - t * 0.5 + offset * 1.5) * 0.1;
                    float wave3 = sin(uv.x * 8.0 + t * 0.3 + offset) * 0.05;
                    
                    float baseHeight = 0.5 + offset * 0.2;
                    float waveHeight = baseHeight + wave1 + wave2 + wave3;
                    
                    // Aurora curtain shape
                    float dist = abs(uv.y - waveHeight);
                    float aurora = smoothstep(0.25, 0.0, dist);
                    
                    // Add noise for organic feel
                    float n = fbm(uv * 3.0 + vec2(t * 0.2, 0.0));
                    aurora *= (0.6 + n * 0.6);
                    
                    // Vertical curtain streaks
                    float streaks = sin(uv.x * 30.0 + t) * 0.5 + 0.5;
                    streaks *= sin(uv.x * 50.0 - t * 1.5) * 0.5 + 0.5;
                    aurora *= 0.7 + streaks * 0.4;
                    
                    return aurora;
                }
                
                // Constellation stars
                float stars(vec2 uv, float time) {
                    float stars = 0.0;
                    
                    for(int i = 0; i < 60; i++) {
                        float fi = float(i);
                        vec2 pos = vec2(
                            hash(vec2(fi * 12.9898, fi * 43.233)),
                            hash(vec2(fi * 78.233, fi * 25.17))
                        );
                        
                        // Star size and brightness variation
                        float size = hash(vec2(fi * 93.214, fi * 15.73)) * 0.0015 + 0.0005;
                        float brightness = hash(vec2(fi * 41.18, fi * 67.32)) * 0.7 + 0.3;
                        
                        // Twinkling effect
                        float twinkle = sin(time * (2.0 + hash(vec2(fi, 0.0)) * 3.0) + fi * 0.5) * 0.4 + 0.6;
                        
                        float dist = length(uv - pos);
                        float star = smoothstep(size, 0.0, dist);
                        
                        // Star glow
                        float glow = smoothstep(size * 8.0, 0.0, dist) * 0.2;
                        
                        stars += (star + glow) * brightness * twinkle;
                    }
                    
                    return stars;
                }
                
                // Floating glowing orbs
                float orbs(vec2 uv, float time) {
                    float orbEffect = 0.0;
                    
                    for(int i = 0; i < 8; i++) {
                        float fi = float(i);
                        
                        // Orbital motion
                        float angle = time * (0.1 + fi * 0.05) + fi * 0.785;
                        float radius = 0.2 + hash(vec2(fi, 0.0)) * 0.25;
                        
                        vec2 center = vec2(0.5, 0.5);
                        vec2 orbPos = center + vec2(cos(angle), sin(angle * 0.7)) * radius;
                        
                        // Slight vertical breathing
                        orbPos.y += sin(time * 0.5 + fi) * 0.05;
                        
                        float orbSize = 0.02 + hash(vec2(fi, 1.0)) * 0.015;
                        float dist = length(uv - orbPos);
                        
                        // Core
                        float core = smoothstep(orbSize, 0.0, dist);
                        
                        // Outer glow
                        float glow = smoothstep(orbSize * 6.0, 0.0, dist) * 0.4;
                        float innerGlow = smoothstep(orbSize * 3.0, 0.0, dist) * 0.3;
                        
                        // Pulsing
                        float pulse = sin(time * 2.0 + fi * 1.3) * 0.3 + 0.7;
                        
                        orbEffect += (core + glow + innerGlow) * pulse;
                    }
                    
                    return orbEffect;
                }
                
                // Light ribbons flowing through space
                float ribbons(vec2 uv, float time) {
                    float ribbon = 0.0;
                    
                    for(int i = 0; i < 4; i++) {
                        float fi = float(i);
                        float t = time * (0.15 + fi * 0.03);
                        
                        // Ribbon path using curves
                        float x = uv.x * 2.0 - 1.0;
                        float baseY = sin(x * 3.0 + t + fi * 1.57) * 0.3;
                        baseY += sin(x * 5.0 - t * 0.7 + fi) * 0.15;
                        
                        float ribbonY = 0.5 + baseY * 0.4 + fi * 0.1 - 0.15;
                        float dist = abs(uv.y - ribbonY);
                        
                        float width = 0.01 + sin(x * 4.0 + t) * 0.005;
                        float r = smoothstep(width * 2.0, 0.0, dist);
                        
                        // Fade at edges
                        float fade = smoothstep(0.0, 0.2, uv.x) * smoothstep(1.0, 0.8, uv.x);
                        
                        ribbon += r * fade * (0.4 - fi * 0.08);
                    }
                    
                    return ribbon;
                }
                
                // Nebula clouds
                float nebula(vec2 uv, float time) {
                    vec2 p = uv * 2.0 - 1.0;
                    p += vec2(time * 0.02, time * 0.01);
                    
                    float n = fbm(p * 1.5);
                    n += fbm(p * 3.0 + vec2(time * 0.05, 0.0)) * 0.5;
                    n *= 0.5;
                    
                    return n;
                }
                
                void main() {
                    vec2 uv = vUv;
                    float t = uTime;
                    
                    // Deep space background with gradient
                    vec3 bg = COL_DEEP_SPACE;
                    bg = mix(bg, vec3(0.02, 0.02, 0.08), uv.y * 0.5);
                    bg = mix(bg, vec3(0.04, 0.01, 0.06), smoothstep(0.3, 0.7, uv.x) * 0.3);
                    
                    vec3 col = bg;
                    
                    // Nebula layer (subtle background texture)
                    float neb = nebula(uv, t);
                    col += vec3(0.1, 0.05, 0.15) * neb * 0.3;
                    col += vec3(0.05, 0.1, 0.12) * neb * 0.2;
                    
                    // Constellation stars
                    float starField = stars(uv, t);
                    col += COL_STAR_WHITE * starField;
                    
                    // Aurora layers with different colors
                    float aurora1 = aurora(uv, t, 0.0);
                    float aurora2 = aurora(uv, t, 0.3);
                    float aurora3 = aurora(uv, t, -0.2);
                    
                    // Blend aurora colors
                    vec3 auroraColor1 = mix(COL_AURORA_GREEN, COL_AURORA_CYAN, sin(t * 0.2) * 0.5 + 0.5);
                    vec3 auroraColor2 = mix(COL_AURORA_PURPLE, COL_AURORA_PINK, cos(t * 0.15) * 0.5 + 0.5);
                    vec3 auroraColor3 = mix(COL_AURORA_CYAN, COL_AURORA_GREEN, sin(t * 0.25 + 1.0) * 0.5 + 0.5);
                    
                    col += auroraColor1 * aurora1 * 0.5;
                    col += auroraColor2 * aurora2 * 0.35;
                    col += auroraColor3 * aurora3 * 0.25;
                    
                    // Light ribbons
                    float ribbonEffect = ribbons(uv, t);
                    vec3 ribbonColor = mix(COL_AURORA_CYAN, COL_AURORA_PURPLE, uv.x);
                    col += ribbonColor * ribbonEffect * 0.6;
                    
                    // Floating orbs
                    float orbEffect = orbs(uv, t);
                    col += COL_ORB_GLOW * orbEffect * 0.8;
                    col += COL_AURORA_CYAN * orbEffect * 0.3;
                    
                    // Central glow (subtle focus point)
                    vec2 center = uv - vec2(0.5, 0.5);
                    float centerGlow = 1.0 - length(center) * 1.2;
                    centerGlow = max(centerGlow, 0.0);
                    centerGlow *= centerGlow * 0.15;
                    col += vec3(0.2, 0.4, 0.6) * centerGlow;
                    
                    // Edge vignette
                    vec2 vignetteUv = uv * (1.0 - uv);
                    float vignette = vignetteUv.x * vignetteUv.y * 18.0;
                    vignette = pow(clamp(vignette, 0.0, 1.0), 0.35);
                    col *= vignette;
                    
                    // Subtle color grading
                    col = pow(col, vec3(0.95));
                    
                    // Saturation boost
                    float luma = dot(col, vec3(0.299, 0.587, 0.114));
                    col = mix(vec3(luma), col, 1.15);
                    
                    // Tone mapping
                    col = col / (col + vec3(0.6));
                    col = pow(col, vec3(1.0 / 2.2));
                    
                    gl_FragColor = vec4(col, 1.0);
                }
            `,
            side: THREE.BackSide,
            depthWrite: false,
        });
    }, [size.width, size.height]);

    useFrame((state) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh ref={meshRef} scale={[150, 150, 150]}>
            <sphereGeometry args={[1, 32, 32]} />
            <primitive object={shaderMaterial} attach="material" />
        </mesh>
    );
};

export default CosmicAuroraBackground;
