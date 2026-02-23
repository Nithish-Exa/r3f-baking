import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import * as THREE from "three";

import { Loader } from "@react-three/drei";
import { Suspense, useState } from "react";
import { WebGPURenderer } from "three/webgpu";
import { useControls } from "leva";

function App() {
  const [frameloop, setFrameloop] = useState("never");

  const { rendererType } = useControls({
    rendererType: {
      value: "webgl",
      options: {
        "WebGPU (Modern)": "webgpu",
        "WebGL (Legacy)": "webgl",
      },
      label: "Renderer",
    }
  });

  return (
    <>
      <Loader />
      <Canvas
        key={rendererType}
        shadows
        camera={{ position: [3, 3, 3], fov: 30 }}
        frameloop={frameloop}
        gl={(canvas) => {
          let renderer;
          if (rendererType === "webgpu") {
            renderer = new WebGPURenderer({
              canvas,
              powerPreference: "high-performance",
              antialias: true,
              alpha: false,
              stencil: false,
              shadowMap: true,
            });
          } else {
            renderer = new THREE.WebGLRenderer({
              canvas,
              powerPreference: "high-performance",
              antialias: true,
              alpha: false,
              stencil: false,
            });
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
          }

          const initPromise = renderer.init ? renderer.init() : Promise.resolve();

          initPromise.then(() => {
            setFrameloop("always");
          });
          return renderer;
        }}
      >
        <color attach="background" args={["#111"]} />
        <Suspense>
          <Experience />
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;
