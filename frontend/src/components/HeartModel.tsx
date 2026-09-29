import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Float, Preload, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Heart() {
  const { scene } = useGLTF('/models/heart.glb');
  const groupRef = useRef<THREE.Group>(null);
  
  // Center and normalize scale slightly if needed
  React.useEffect(() => {
    if (scene) {
      // Ensure material is clean, possibly adjust some properties if necessary
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
      
      // Auto-center the model geometry bounds
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.x += (scene.position.x - center.x);
      scene.position.y += (scene.position.y - center.y);
      scene.position.z += (scene.position.z - center.z);
    }
  }, [scene]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Subtle rotation around vertical axis
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} dispose={null} scale={2}>
      <primitive object={scene} />
    </group>
  );
}

function Loader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-mainBg rounded-xl z-10 text-center">
      <div className="w-8 h-8 border-4 border-[#D99A4A]/30 border-t-[#D99A4A] rounded-full animate-spin mb-3"></div>
      <p className="text-brand-amberMain font-medium text-sm">Loading 3D Heart...</p>
    </div>
  );
}

export default function HeartModelVisualization({ scale = 1 }: { isInteractive?: boolean, scale?: number }) {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden pointer-events-none" aria-label="Interactive 3D heart visualization" role="img">
      <Suspense fallback={<Loader />}>
        <Canvas 
          camera={{ position: [0, 0, 8], fov: 45 }} 
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
          dpr={[1, 2]} // Optimize for performance and retina displays
          shadows
        >
          {/* Lighting optimized for dark navy and champagne gold UI */}
          <ambientLight intensity={0.4} />
          
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1.5} 
            color="#FFFFFF" 
            castShadow 
          />
          <directionalLight 
            position={[-5, 5, 5]} 
            intensity={0.8} 
            color="#E8B56A" // Champagne gold fill
          />
          <pointLight 
            position={[0, -2, -5]} 
            intensity={0.5} 
            color="#F2C982" // Backlight / Rim
          />

          <Environment preset="city" blur={0.8} />

          <Float 
            speed={prefersReducedMotion ? 0 : 1.5} 
            rotationIntensity={prefersReducedMotion ? 0 : 0.2} 
            floatIntensity={prefersReducedMotion ? 0 : 0.8} 
            floatingRange={[-0.1, 0.1]}
          >
            <group scale={scale}>
              <Heart />
            </group>
          </Float>

          <ContactShadows 
            position={[0, -2.5, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={4} 
            color="#000000"
          />
          
          <Preload all />
        </Canvas>
      </Suspense>
    </div>
  );
}

// Pre-load the GLTF to avoid pop-in
useGLTF.preload('/models/heart.glb');
