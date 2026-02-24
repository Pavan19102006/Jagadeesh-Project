import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

const PostProcessing = () => {
    return (
        <EffectComposer multisampling={0}>
            {/* Bloom for glow effects */}
            <Bloom
                intensity={0.6}
                luminanceThreshold={0.3}
                luminanceSmoothing={0.9}
                mipmapBlur
                radius={0.7}
            />

            {/* Subtle chromatic aberration for lens effect */}
            <ChromaticAberration
                blendFunction={BlendFunction.NORMAL}
                offset={[0.0004, 0.0004]}
                radialModulation={true}
                modulationOffset={0.5}
            />

            {/* Cinematic vignette */}
            <Vignette
                offset={0.3}
                darkness={0.4}
                blendFunction={BlendFunction.NORMAL}
            />
        </EffectComposer>
    );
};

export default PostProcessing;
