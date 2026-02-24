import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * WorkStudyBackground - A professional raymarched WebGL shader background
 * featuring floating glass panels, student cubes, network connections,
 * grid floor, and subtle particles for a Work-Study Management System.
 */
const WorkStudyBackground = () => {
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
                
                // Color palette - Professional navy theme
                #define COL_DEEP_NAVY vec3(0.02, 0.02, 0.08)
                #define COL_NAVY vec3(0.04, 0.04, 0.15)
                #define COL_CYAN vec3(0.0, 0.83, 1.0)
                #define COL_WHITE vec3(0.95, 0.97, 1.0)
                #define COL_PURPLE vec3(0.66, 0.33, 0.97)
                #define COL_GLASS vec3(0.15, 0.25, 0.4)
                
                // Smooth minimum for blending SDFs
                float smin(float a, float b, float k) {
                    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
                    return mix(b, a, h) - k * h * (1.0 - h);
                }
                
                // Box SDF
                float sdBox(vec3 p, vec3 b) {
                    vec3 q = abs(p) - b;
                    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
                }
                
                // Rounded box SDF
                float sdRoundBox(vec3 p, vec3 b, float r) {
                    vec3 q = abs(p) - b;
                    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
                }
                
                // Infinite grid floor
                float sdPlane(vec3 p, float y) {
                    return p.y - y;
                }
                
                // Rotation matrix
                mat2 rot2D(float angle) {
                    float s = sin(angle);
                    float c = cos(angle);
                    return mat2(c, -s, s, c);
                }
                
                // Hash function for pseudo-random values
                float hash(float n) {
                    return fract(sin(n) * 43758.5453123);
                }
                
                // 3D noise
                float noise3D(vec3 p) {
                    vec3 i = floor(p);
                    vec3 f = fract(p);
                    f = f * f * (3.0 - 2.0 * f);
                    float n = i.x + i.y * 157.0 + 113.0 * i.z;
                    return mix(
                        mix(mix(hash(n), hash(n + 1.0), f.x),
                            mix(hash(n + 157.0), hash(n + 158.0), f.x), f.y),
                        mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                            mix(hash(n + 270.0), hash(n + 271.0), f.x), f.y), f.z);
                }
                
                // Floating glass panel (job posting card)
                float sdGlassPanel(vec3 p, vec3 pos, vec3 size, float rotY, float rotX) {
                    vec3 q = p - pos;
                    q.xz *= rot2D(rotY);
                    q.yz *= rot2D(rotX);
                    return sdRoundBox(q, size, 0.02);
                }
                
                // Small cube (student)
                float sdStudentCube(vec3 p, vec3 pos, float size, float rot) {
                    vec3 q = p - pos;
                    q.xz *= rot2D(rot);
                    q.xy *= rot2D(rot * 0.7);
                    return sdBox(q, vec3(size));
                }
                
                // Scene SDF - all objects combined
                float map(vec3 p) {
                    float t = uTime * 0.15;
                    float d = 1000.0;
                    
                    // Floating glass panels (job postings) - 5 panels
                    float panel1 = sdGlassPanel(p, 
                        vec3(-2.5, 0.3 + sin(t * 0.8) * 0.15, -4.0), 
                        vec3(0.8, 0.5, 0.02), 
                        0.3 + sin(t * 0.5) * 0.1, 
                        0.1 + cos(t * 0.3) * 0.05);
                    
                    float panel2 = sdGlassPanel(p, 
                        vec3(2.0, -0.2 + sin(t * 0.6 + 1.0) * 0.12, -3.5), 
                        vec3(0.7, 0.45, 0.02), 
                        -0.25 + sin(t * 0.4) * 0.08, 
                        -0.08 + cos(t * 0.35) * 0.04);
                    
                    float panel3 = sdGlassPanel(p, 
                        vec3(0.0, 0.8 + sin(t * 0.7 + 2.0) * 0.1, -5.0), 
                        vec3(0.9, 0.55, 0.02), 
                        sin(t * 0.45) * 0.12, 
                        0.05 + cos(t * 0.25) * 0.03);
                    
                    float panel4 = sdGlassPanel(p, 
                        vec3(-1.5, -0.5 + sin(t * 0.9 + 3.0) * 0.08, -6.0), 
                        vec3(0.6, 0.4, 0.02), 
                        0.5 + sin(t * 0.55) * 0.1, 
                        -0.1 + cos(t * 0.4) * 0.05);
                    
                    float panel5 = sdGlassPanel(p, 
                        vec3(3.0, 0.5 + sin(t * 0.5 + 4.0) * 0.1, -5.5), 
                        vec3(0.65, 0.42, 0.02), 
                        -0.4 + sin(t * 0.35) * 0.08, 
                        0.12 + cos(t * 0.45) * 0.04);
                    
                    d = min(d, panel1);
                    d = min(d, panel2);
                    d = min(d, panel3);
                    d = min(d, panel4);
                    d = min(d, panel5);
                    
                    // Student cubes - 12 small cubes
                    float cube1 = sdStudentCube(p, vec3(-3.5, -0.8, -3.0), 0.08, t * 0.5);
                    float cube2 = sdStudentCube(p, vec3(1.5, 0.6, -4.5), 0.07, t * 0.6 + 1.0);
                    float cube3 = sdStudentCube(p, vec3(-1.0, -0.3, -3.8), 0.06, t * 0.4 + 2.0);
                    float cube4 = sdStudentCube(p, vec3(2.8, -0.6, -4.8), 0.08, t * 0.55 + 3.0);
                    float cube5 = sdStudentCube(p, vec3(-2.2, 0.9, -5.2), 0.065, t * 0.45 + 4.0);
                    float cube6 = sdStudentCube(p, vec3(0.5, -0.9, -3.2), 0.07, t * 0.5 + 5.0);
                    float cube7 = sdStudentCube(p, vec3(-0.8, 0.4, -6.0), 0.06, t * 0.65 + 6.0);
                    float cube8 = sdStudentCube(p, vec3(3.5, 0.2, -4.2), 0.075, t * 0.48 + 7.0);
                    float cube9 = sdStudentCube(p, vec3(-3.0, 0.1, -5.8), 0.065, t * 0.52 + 8.0);
                    float cube10 = sdStudentCube(p, vec3(1.8, -0.4, -5.5), 0.07, t * 0.58 + 9.0);
                    float cube11 = sdStudentCube(p, vec3(-1.8, -0.7, -4.2), 0.055, t * 0.42 + 10.0);
                    float cube12 = sdStudentCube(p, vec3(0.2, 0.7, -4.0), 0.06, t * 0.62 + 11.0);
                    
                    d = min(d, cube1);
                    d = min(d, cube2);
                    d = min(d, cube3);
                    d = min(d, cube4);
                    d = min(d, cube5);
                    d = min(d, cube6);
                    d = min(d, cube7);
                    d = min(d, cube8);
                    d = min(d, cube9);
                    d = min(d, cube10);
                    d = min(d, cube11);
                    d = min(d, cube12);
                    
                    // Grid floor plane
                    float floorDist = sdPlane(p, -1.5);
                    d = smin(d, floorDist, 0.5);
                    
                    return d;
                }
                
                // Calculate normal using gradient
                vec3 calcNormal(vec3 p) {
                    const float h = 0.001;
                    const vec2 k = vec2(1, -1);
                    return normalize(
                        k.xyy * map(p + k.xyy * h) +
                        k.yyx * map(p + k.yyx * h) +
                        k.yxy * map(p + k.yxy * h) +
                        k.xxx * map(p + k.xxx * h)
                    );
                }
                
                // Soft shadow
                float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
                    float res = 1.0;
                    float t = mint;
                    for(int i = 0; i < 16; i++) {
                        float h = map(ro + rd * t);
                        res = min(res, k * h / t);
                        t += clamp(h, 0.02, 0.25);
                        if(h < 0.001 || t > maxt) break;
                    }
                    return clamp(res, 0.0, 1.0);
                }
                
                // Ambient occlusion
                float calcAO(vec3 pos, vec3 nor) {
                    float occ = 0.0;
                    float sca = 1.0;
                    for(int i = 0; i < 5; i++) {
                        float h = 0.01 + 0.12 * float(i) / 4.0;
                        float d = map(pos + h * nor);
                        occ += (h - d) * sca;
                        sca *= 0.95;
                    }
                    return clamp(1.0 - 3.0 * occ, 0.0, 1.0);
                }
                
                // Network connection lines - glow effect
                float connectionLine(vec2 uv, vec2 p1, vec2 p2, float thickness) {
                    vec2 pa = uv - p1;
                    vec2 ba = p2 - p1;
                    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
                    float d = length(pa - ba * h);
                    return smoothstep(thickness, 0.0, d);
                }
                
                // Grid pattern
                float gridPattern(vec2 uv, float scale) {
                    vec2 grid = abs(fract(uv * scale - 0.5) - 0.5) / fwidth(uv * scale);
                    float line = min(grid.x, grid.y);
                    return 1.0 - min(line, 1.0);
                }
                
                // Particle field
                float particles(vec2 uv, float t) {
                    float particles = 0.0;
                    for(int i = 0; i < 15; i++) {
                        float fi = float(i);
                        vec2 pos = vec2(
                            hash(fi * 12.9898) * 2.0 - 1.0 + sin(t * 0.2 + fi) * 0.1,
                            hash(fi * 78.233) * 2.0 - 1.0 + cos(t * 0.15 + fi * 1.3) * 0.08
                        );
                        float size = hash(fi * 43.758) * 0.003 + 0.002;
                        float brightness = hash(fi * 93.214) * 0.5 + 0.5;
                        float dist = length(uv - pos);
                        particles += brightness * smoothstep(size, 0.0, dist);
                    }
                    return particles;
                }
                
                void main() {
                    vec2 uv = vUv;
                    vec2 centeredUv = (vUv - 0.5) * 2.0;
                    float aspect = uResolution.x / uResolution.y;
                    centeredUv.x *= aspect;
                    
                    float t = uTime * 0.1;
                    
                    // Camera setup with slow movement
                    vec3 ro = vec3(
                        sin(t * 0.3) * 0.5, 
                        cos(t * 0.2) * 0.2 + 0.1, 
                        2.0 + sin(t * 0.15) * 0.3
                    );
                    vec3 lookAt = vec3(0.0, 0.0, -4.0);
                    
                    // Camera matrix
                    vec3 forward = normalize(lookAt - ro);
                    vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
                    vec3 up = cross(forward, right);
                    
                    vec3 rd = normalize(centeredUv.x * right + centeredUv.y * up + 1.8 * forward);
                    
                    // Background gradient - deep navy
                    vec3 bgColor = mix(COL_DEEP_NAVY, COL_NAVY, uv.y * 0.8 + 0.1);
                    bgColor = mix(bgColor, COL_NAVY * 1.2, smoothstep(0.3, 0.7, uv.x) * 0.3);
                    
                    // Add subtle noise to background
                    float bgNoise = noise3D(vec3(uv * 3.0, t * 0.5)) * 0.02;
                    bgColor += bgNoise;
                    
                    vec3 col = bgColor;
                    
                    // Raymarching
                    float totalDist = 0.0;
                    vec3 p = ro;
                    bool hit = false;
                    
                    for(int i = 0; i < 40; i++) {
                        float d = map(p);
                        if(d < 0.001) {
                            hit = true;
                            break;
                        }
                        if(totalDist > 20.0) break;
                        totalDist += d;
                        p = ro + rd * totalDist;
                    }
                    
                    if(hit) {
                        vec3 normal = calcNormal(p);
                        
                        // Lighting
                        vec3 lightPos = vec3(2.0, 3.0, 2.0);
                        vec3 lightDir = normalize(lightPos - p);
                        
                        // Diffuse
                        float diff = max(dot(normal, lightDir), 0.0);
                        
                        // Specular
                        vec3 viewDir = normalize(ro - p);
                        vec3 reflectDir = reflect(-lightDir, normal);
                        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
                        
                        // Fresnel for glass effect
                        float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
                        
                        // Ambient occlusion
                        float ao = calcAO(p, normal);
                        
                        // Soft shadow
                        float shadow = softShadow(p, lightDir, 0.02, 5.0, 8.0);
                        
                        // Material color - glass panels and cubes
                        vec3 matColor = COL_GLASS;
                        matColor = mix(matColor, COL_CYAN * 0.5, fresnel * 0.6);
                        
                        // Combine lighting
                        vec3 ambient = matColor * 0.15 * ao;
                        vec3 diffuse = matColor * diff * 0.6 * shadow;
                        vec3 specular = COL_WHITE * spec * 0.4 * shadow;
                        vec3 rim = COL_CYAN * fresnel * 0.3;
                        
                        col = ambient + diffuse + specular + rim;
                        
                        // Add purple accent on edges
                        col += COL_PURPLE * fresnel * 0.15;
                        
                        // Blend with background for transparency
                        col = mix(col, bgColor, 0.3);
                    }
                    
                    // Network connection lines overlay
                    float connections = 0.0;
                    connections += connectionLine(centeredUv, vec2(-1.0, 0.2), vec2(0.5, -0.3), 0.008) * 0.3;
                    connections += connectionLine(centeredUv, vec2(0.8, 0.5), vec2(-0.3, 0.1), 0.006) * 0.25;
                    connections += connectionLine(centeredUv, vec2(-0.5, -0.4), vec2(1.0, 0.2), 0.007) * 0.28;
                    connections += connectionLine(centeredUv, vec2(0.2, 0.6), vec2(-0.8, -0.2), 0.005) * 0.22;
                    connections += connectionLine(centeredUv, vec2(-1.2, 0.4), vec2(0.4, 0.5), 0.006) * 0.26;
                    
                    // Animate connection glow
                    float connectionGlow = connections * (0.7 + sin(t * 2.0) * 0.3);
                    col += COL_CYAN * connectionGlow * 0.5;
                    col += COL_PURPLE * connectionGlow * 0.2;
                    
                    // Grid floor effect (subtle)
                    float gridY = smoothstep(0.0, 0.4, 1.0 - uv.y);
                    float grid = gridPattern(centeredUv + vec2(t * 0.1, 0.0), 5.0) * gridY * 0.08;
                    col += COL_CYAN * grid * 0.3;
                    
                    // Particles
                    float pts = particles(centeredUv, uTime);
                    col += COL_WHITE * pts * 0.4;
                    col += COL_CYAN * pts * 0.2;
                    
                    // Subtle bloom/glow effect
                    float glow = 0.0;
                    glow += smoothstep(0.8, 0.0, length(centeredUv - vec2(-0.8, 0.2))) * 0.03;
                    glow += smoothstep(0.9, 0.0, length(centeredUv - vec2(0.7, -0.1))) * 0.025;
                    glow += smoothstep(1.0, 0.0, length(centeredUv - vec2(0.0, 0.4))) * 0.02;
                    col += COL_CYAN * glow;
                    col += COL_PURPLE * glow * 0.5;
                    
                    // Vignette
                    vec2 vignetteUv = uv * (1.0 - uv);
                    float vignette = vignetteUv.x * vignetteUv.y * 15.0;
                    vignette = pow(clamp(vignette, 0.0, 1.0), 0.4);
                    col *= vignette;
                    
                    // Gamma correction and tone mapping
                    col = pow(col, vec3(0.9));
                    col = col / (col + vec3(0.5));
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

export default WorkStudyBackground;
