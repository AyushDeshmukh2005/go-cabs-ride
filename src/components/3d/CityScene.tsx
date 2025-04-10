
import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Lazy load the car model to improve performance
const Car = () => {
  // Simple placeholder model while the real model loads
  return (
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[2, 1, 4]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  );
};

// City buildings - simple shapes for performance
const Buildings = () => {
  const buildings = [];
  const buildingCount = 20;
  const citySize = 50;
  
  for (let i = 0; i < buildingCount; i++) {
    const height = Math.random() * 10 + 5;
    const width = Math.random() * 5 + 2;
    const depth = Math.random() * 5 + 2;
    
    const x = Math.random() * citySize - citySize / 2;
    const z = Math.random() * citySize - citySize / 2;
    
    // Don't place buildings in the center where the car will be
    if (Math.abs(x) < 5 && Math.abs(z) < 5) continue;
    
    buildings.push(
      <mesh key={i} position={[x, height / 2, z]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    );
  }
  
  return <>{buildings}</>;
};

// Animated camera that follows a path
const MovingCamera = () => {
  const { camera } = useThree();
  const time = useRef(0);
  
  useFrame(({ clock }) => {
    time.current = clock.getElapsedTime() * 0.2;
    
    // Create a circular path for the camera
    camera.position.x = Math.sin(time.current) * 15;
    camera.position.z = Math.cos(time.current) * 15;
    camera.position.y = 8 + Math.sin(time.current * 0.5) * 2;
    
    // Look at the center
    camera.lookAt(0, 0, 0);
  });
  
  return null;
};

// Ground plane
const Ground = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#333333" />
    </mesh>
  );
};

// Roads
const Roads = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[8, 100]} />
      <meshStandardMaterial color="#222222" />
    </mesh>
  );
};

// Main component
const CityScene = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    // Mark as mounted for cleanup
    isMounted.current = true;

    // Mark as loaded after a brief delay to ensure smooth rendering
    const timer = setTimeout(() => {
      if (isMounted.current) {
        setIsLoaded(true);
      }
    }, 800);

    // Cleanup function
    return () => {
      isMounted.current = false;
      clearTimeout(timer);
    };
  }, []);

  const handleError = () => {
    console.error("Error loading 3D scene");
    setIsError(true);
  };

  return (
    <div className="w-full h-[500px] relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-600">
          <div className="animate-pulse text-white text-xl">Loading City Scene...</div>
        </div>
      )}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-600">
          <div className="text-white text-xl">
            <p>Unable to load 3D scene.</p>
            <p className="text-sm">Please check your device compatibility.</p>
          </div>
        </div>
      )}
      <div 
        className={`w-full h-full ${isLoaded && !isError ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        style={{ perspective: '800px' }}
      >
        <Canvas 
          shadows 
          className="rounded-lg overflow-hidden" 
          dpr={[1, 2]} 
          onCreated={(state) => {
            state.gl.setClearColor(new THREE.Color('#1E40AF')); // Match brand blue
          }}
          onError={handleError}
        >
          <PerspectiveCamera makeDefault position={[15, 8, 15]} fov={45} />
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow 
            shadow-mapSize-width={1024} 
            shadow-mapSize-height={1024}
          />
          <MovingCamera />
          <Car />
          <Buildings />
          <Ground />
          <Roads />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            enableRotate={false} 
            autoRotate 
            autoRotateSpeed={0.5} 
          />
          <Environment preset="city" />
        </Canvas>
      </div>
    </div>
  );
};

export default CityScene;
