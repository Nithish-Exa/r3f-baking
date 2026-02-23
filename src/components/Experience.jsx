import { CameraControls, ContactShadows, Environment, Gltf, useGLTF } from "@react-three/drei";
import { useControls } from "leva";
import { degToRad } from "three/src/math/MathUtils.js";
import StatsDisplay from "./StatsDisplay";

export const Experience = () => {
  const { bakedMode } = useControls({
    bakedMode: {
      value: false,
      label: "Baked Lighting",
    }
  });

  const { ambientIntensity, directionalIntensity, shadowBias } = useControls("Normal Lighting Settings", {
    ambientIntensity: {
      value: 0.4,
      min: 0,
      max: 2,
      step: 0.1,
      label: "Ambient",
      render: (get) => !get("bakedMode"),
    },
    directionalIntensity: {
      value: 1.5,
      min: 0,
      max: 5,
      step: 0.1,
      label: "Directional",
      render: (get) => !get("bakedMode"),
    },
    shadowBias: {
      value: -0.001,
      min: -0.01,
      max: 0.01,
      step: 0.0001,
      label: "Shadow Bias",
      render: (get) => !get("bakedMode"),
    }
  }, { collapsed: true });

  return (
    <>
      <StatsDisplay />

      <CameraControls
        makeDefault
        maxDistance={8}
        minDistance={1}
        minPolarAngle={0}
        maxPolarAngle={degToRad(80)}
      />

      <Environment preset="dawn" background blur={0.8} />

      {/* Baked Scene */}
      {bakedMode && (
        <Gltf
          src="/models/Living room_Baked.glb"
          receiveShadow
          castShadow
        />
      )}

      {/* Normal Scene */}
      {!bakedMode && (
        <>
          <Gltf
            src="/models/Living room.glb"
            receiveShadow
            castShadow
          />
          <ContactShadows
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
            resolution={512}
            color="#000000"
          />
          <ambientLight intensity={ambientIntensity} />
          <directionalLight
            position={[5, 8, 5]}
            intensity={directionalIntensity}
            castShadow
            shadow-bias={shadowBias}
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={30}
            shadow-camera-left={-6}
            shadow-camera-right={6}
            shadow-camera-top={6}
            shadow-camera-bottom={-6}
          />
          <pointLight position={[-3, 4, -2]} intensity={0.5} color="#ffd4a3" />
        </>
      )}
    </>
  );
};

useGLTF.preload("/models/Living room_Baked.glb");
useGLTF.preload("/models/Living room.glb");
