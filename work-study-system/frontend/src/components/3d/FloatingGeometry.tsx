import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';

interface FloatingShapeProps {
    position: [number, number, number];
    geometry: 'icosahedron' | 'torus' | 'octahedron' | 'sphere' | 'torusKnot' | 'dodecahedron';
    scale?: number;
    speed?: number;
    rotationIntensity?: number;
    floatIntensity?: number;
    materialType?: 'holographic' | 'glass' | 'wireframe' | 'noise';
}

// Holographic shader material with Fresnel-based color shifting
const HolographicMaterial = () => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor1: { value: new THREE.Color('#00f5ff') },
                uColor2: { value: new THREE.Color('#7c3aed') },
                uColor3: { value: new THREE.Color('#f472b6') },
            },
            vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        
        uniform float uTime;
        
        // Simplex noise for vertex displacement
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          // Organic vertex displacement
          vec3 pos = position;
          float noise = snoise(position * 1.5 + uTime * 0.2) * 0.05;
          pos += normal * noise;
          
          vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
            fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;
        
        void main() {
          // Fresnel effect for holographic look
          vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 3.0);
          
          // Animated color shifting
          float t1 = sin(uTime * 0.5 + vPosition.y * 2.0) * 0.5 + 0.5;
          float t2 = cos(uTime * 0.3 + vPosition.x * 2.0) * 0.5 + 0.5;
          
          // Three-color blend
          vec3 color = mix(uColor1, uColor2, t1);
          color = mix(color, uColor3, t2 * fresnel);
          
          // Holographic shimmer
          float shimmer = sin(vPosition.x * 20.0 + uTime * 2.0) * sin(vPosition.y * 20.0 + uTime * 1.5);
          color += shimmer * 0.1;
          
          // Rim lighting
          float rim = pow(fresnel, 2.0);
          color += uColor1 * rim * 0.5;
          
          float alpha = 0.7 + fresnel * 0.3;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
            transparent: true,
            side: THREE.DoubleSide,
        });
    }, []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return <primitive ref={materialRef} object={shaderMaterial} attach="material" />;
};

// Wireframe glow material with procedural edge detection
const WireframeGlowMaterial = ({ color = '#00ffff' }: { color?: string }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(color) },
            },
            vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          // Smooth pulse
          float pulse = sin(uTime * 1.5) * 0.15 + 0.85;
          
          // Edge glow
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float edge = 1.0 - abs(dot(viewDir, vNormal));
          edge = pow(edge, 1.5);
          
          vec3 color = uColor * pulse;
          color += uColor * edge * 0.5;
          color += vec3(1.0) * edge * 0.2;
          
          gl_FragColor = vec4(color, 0.9);
        }
      `,
            transparent: true,
            wireframe: true,
        });
    }, [color]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return <primitive ref={materialRef} object={shaderMaterial} attach="material" />;
};

// Noise displacement material
const NoiseDisplacementMaterial = () => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
            },
            vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vDisplacement;
        
        uniform float uTime;
        
        // Simplex noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          
          // Noise displacement
          float displacement = snoise(position * 2.0 + uTime * 0.3) * 0.15;
          vec3 pos = position + normal * displacement;
          vDisplacement = displacement;
          
          vPosition = pos;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
            fragmentShader: `
        uniform float uTime;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vDisplacement;
        
        void main() {
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.0);
          
          // Color based on displacement
          vec3 color1 = vec3(0.0, 0.8, 1.0);
          vec3 color2 = vec3(0.5, 0.0, 1.0);
          vec3 color = mix(color1, color2, vDisplacement * 3.0 + 0.5);
          
          color += fresnel * 0.3;
          
          float alpha = 0.8 + fresnel * 0.2;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
            transparent: true,
            side: THREE.DoubleSide,
        });
    }, []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return <primitive ref={materialRef} object={shaderMaterial} attach="material" />;
};

const FloatingShape = ({
    position,
    geometry,
    scale = 1,
    speed = 1,
    rotationIntensity = 1,
    floatIntensity = 1,
    materialType = 'holographic',
}: FloatingShapeProps) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x += 0.002 * speed * rotationIntensity;
        meshRef.current.rotation.y += 0.003 * speed * rotationIntensity;
    });

    const getGeometry = () => {
        switch (geometry) {
            case 'icosahedron':
                return <icosahedronGeometry args={[1, 2]} />;
            case 'torus':
                return <torusGeometry args={[1, 0.4, 32, 64]} />;
            case 'octahedron':
                return <octahedronGeometry args={[1, 0]} />;
            case 'sphere':
                return <sphereGeometry args={[1, 64, 64]} />;
            case 'torusKnot':
                return <torusKnotGeometry args={[0.8, 0.25, 128, 32]} />;
            case 'dodecahedron':
                return <dodecahedronGeometry args={[1, 0]} />;
            default:
                return <icosahedronGeometry args={[1, 2]} />;
        }
    };

    const getMaterial = () => {
        switch (materialType) {
            case 'holographic':
                return <HolographicMaterial />;
            case 'glass':
                return (
                    <MeshTransmissionMaterial
                        backside
                        samples={6}
                        thickness={0.5}
                        chromaticAberration={0.8}
                        anisotropy={0.5}
                        distortion={0.5}
                        distortionScale={0.4}
                        temporalDistortion={0.15}
                        iridescence={1}
                        iridescenceIOR={1.5}
                        iridescenceThicknessRange={[0, 1400]}
                        clearcoat={1}
                    />
                );
            case 'wireframe':
                return <WireframeGlowMaterial color="#00ffcc" />;
            case 'noise':
                return <NoiseDisplacementMaterial />;
            default:
                return <HolographicMaterial />;
        }
    };

    return (
        <Float
            speed={speed}
            rotationIntensity={rotationIntensity * 0.5}
            floatIntensity={floatIntensity}
        >
            <mesh ref={meshRef} position={position} scale={scale}>
                {getGeometry()}
                {getMaterial()}
            </mesh>
        </Float>
    );
};

const FloatingGeometry = () => {
    return (
        <group>
            {/* Central hero shape - large holographic icosahedron */}
            <FloatingShape
                position={[0, 0, -2]}
                geometry="icosahedron"
                materialType="holographic"
                scale={2}
                speed={0.5}
                rotationIntensity={0.4}
                floatIntensity={0.5}
            />

            {/* Glass torus */}
            <FloatingShape
                position={[-4, 1.5, -4]}
                geometry="torus"
                materialType="glass"
                scale={1}
                speed={0.8}
                rotationIntensity={1}
                floatIntensity={0.8}
            />

            {/* Wireframe octahedron */}
            <FloatingShape
                position={[4, -1, -3]}
                geometry="octahedron"
                materialType="wireframe"
                scale={0.8}
                speed={1}
                rotationIntensity={1.5}
                floatIntensity={1}
            />

            {/* Noise displacement sphere */}
            <FloatingShape
                position={[-3, -2, -5]}
                geometry="sphere"
                materialType="noise"
                scale={0.7}
                speed={0.6}
                rotationIntensity={0.5}
                floatIntensity={0.6}
            />

            {/* Holographic torus knot */}
            <FloatingShape
                position={[3.5, 2.5, -6]}
                geometry="torusKnot"
                materialType="holographic"
                scale={0.6}
                speed={0.7}
                rotationIntensity={0.8}
                floatIntensity={1}
            />

            {/* Wireframe dodecahedron */}
            <FloatingShape
                position={[-5, 0, -7]}
                geometry="dodecahedron"
                materialType="wireframe"
                scale={0.6}
                speed={0.6}
                rotationIntensity={0.8}
                floatIntensity={0.6}
            />

            {/* Small glass torus */}
            <FloatingShape
                position={[5, -0.5, -5]}
                geometry="torus"
                materialType="glass"
                scale={0.5}
                speed={1}
                rotationIntensity={1.2}
                floatIntensity={0.8}
            />
        </group>
    );
};

export default FloatingGeometry;
