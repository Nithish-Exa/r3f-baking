import { CameraControls, Environment, Gltf, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect } from "react";
import { degToRad } from "three/src/math/MathUtils.js";

export const Experience = () => {
  const { showBakedScene } = useControls({
    showBakedScene: true,
  });

  const controls = useThree((state) => state.controls);

  const animate = async () => {
    controls.setLookAt(8, 8, 8, 3, 0, 0);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    controls.smoothTime = 0.6;
    await controls.setLookAt(1.2, 0.5, 1.2, 0, 0.2, 0, true);
  };

  useEffect(() => {
    if (!controls) {
      return;
    }
    animate();
  }, [controls]);
  return (
    <>
      <CameraControls
        makeDefault
        maxDistance={8}
        minDistance={1}
        minPolarAngle={0}
        maxPolarAngle={degToRad(80)}
      />
      <Environment preset="dawn" background blur={3} />
      {showBakedScene && (
        <Gltf src="/models/Living room_Baked.glb" receiveShadow castShadow />
      )}
      {!showBakedScene && (
        <>
          <Gltf src="/models/Living room.glb" receiveShadow castShadow />
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={2}
            castShadow
            shadow-normalBias={0.08}
          />
        </>
      )}
    </>
  );
};

useGLTF.preload("/models/Living room_Baked.glb");
useGLTF.preload("/models/Living room.glb");
