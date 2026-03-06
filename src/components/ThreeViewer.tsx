import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Center, Text } from '@react-three/drei';
import * as THREE from 'three';

interface BoxProps {
  position: [number, number, number];
  mode: 'geometry' | 'mesh' | 'result';
}

function Box({ position, mode }: BoxProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state, delta) => {
    if (mode === 'result') {
       meshRef.current.rotation.x += delta * 0.2;
       meshRef.current.rotation.y += delta * 0.1;
    }
  });

  const color = mode === 'result' 
    ? (hovered ? 'hotpink' : 'orange') 
    : (mode === 'mesh' ? '#4ade80' : '#60a5fa');

  return (
    <mesh
      position={position}
      ref={meshRef}
      scale={active ? 1.2 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial 
        color={color} 
        wireframe={mode === 'mesh'}
        transparent={mode === 'mesh'}
        opacity={mode === 'mesh' ? 0.5 : 1}
      />
      {mode === 'mesh' && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.5, 1.5, 1.5)]} />
          <lineBasicMaterial color="#ffffff" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
}

interface ThreeViewerProps {
  mode?: 'geometry' | 'mesh' | 'result';
}

export function ThreeViewer({ mode = 'geometry' }: ThreeViewerProps) {
  return (
    <div className="h-full w-full bg-zinc-950 relative overflow-hidden rounded-lg border border-white/10">
      <Canvas camera={{ position: [4, 4, 4], fov: 45 }}>
        <color attach="background" args={['#09090b']} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Center>
          <Box position={[0, 0, 0]} mode={mode} />
        </Center>

        <Grid 
          infiniteGrid 
          fadeDistance={30} 
          sectionColor="#3f3f46" 
          cellColor="#27272a" 
          position={[0, -2, 0]}
        />
        
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
        <Environment preset="city" />
      </Canvas>
      
      <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur border border-white/10 p-3 rounded-lg text-white text-xs shadow-xl">
        <div className="font-medium mb-2 text-zinc-400 uppercase tracking-wider">
          {mode === 'geometry' && '几何视图'}
          {mode === 'mesh' && '网格视图'}
          {mode === 'result' && '结果视图'}
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-300">渲染中</span>
          </div>
          <div className="text-zinc-500">|</div>
          <div className="text-zinc-400">FPS: 60</div>
        </div>
        {mode === 'result' && (
          <div className="mt-3 pt-3 border-t border-white/10">
             <div className="flex justify-between text-[10px] text-zinc-500 mb-1">
               <span>300K</span>
               <span>1800K</span>
             </div>
             <div className="h-2 w-32 rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500" />
             <div className="text-center mt-1 text-[10px] text-zinc-400">温度 (K)</div>
          </div>
        )}
      </div>
    </div>
  );
}
