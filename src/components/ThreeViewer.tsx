import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Center } from '@react-three/drei';
import * as THREE from 'three';

interface BoxProps {
  position: [number, number, number];
  mode: 'geometry' | 'mesh' | 'result';
}

function DefaultBox({ position, mode }: BoxProps) {
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

function BlastFurnace({ mode }: { mode: 'geometry' | 'mesh' | 'result' }) {
  const groupRef = useRef<THREE.Group>(null!);
  
  useFrame((state, delta) => {
    if (mode === 'result') {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  const materialProps = {
    color: mode === 'result' ? '#ef4444' : (mode === 'mesh' ? '#4ade80' : '#60a5fa'),
    wireframe: mode === 'mesh',
    transparent: mode === 'mesh' || mode === 'result',
    opacity: mode === 'mesh' ? 0.5 : (mode === 'result' ? 0.8 : 1),
  };

  return (
    <group ref={groupRef} position={[0, -1.5, 0]}>
      {/* Hearth */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 1, 32]} />
        <meshStandardMaterial {...materialProps} color={mode === 'result' ? '#b91c1c' : materialProps.color} />
      </mesh>
      {/* Bosh */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[1.5, 1.2, 1, 32]} />
        <meshStandardMaterial {...materialProps} color={mode === 'result' ? '#ef4444' : materialProps.color} />
      </mesh>
      {/* Belly */}
      <mesh position={[0, 2.25, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.5, 32]} />
        <meshStandardMaterial {...materialProps} color={mode === 'result' ? '#f97316' : materialProps.color} />
      </mesh>
      {/* Stack */}
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0.8, 1.5, 2, 32]} />
        <meshStandardMaterial {...materialProps} color={mode === 'result' ? '#eab308' : materialProps.color} />
      </mesh>
      {/* Throat */}
      <mesh position={[0, 4.75, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.5, 32]} />
        <meshStandardMaterial {...materialProps} color={mode === 'result' ? '#3b82f6' : materialProps.color} />
      </mesh>
    </group>
  );
}

function Converter({ mode }: { mode: 'geometry' | 'mesh' | 'result' }) {
  const groupRef = useRef<THREE.Group>(null!);
  const lanceRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state, delta) => {
    if (mode === 'result') {
      groupRef.current.rotation.y += delta * 0.1;
      // Lance moving up and down slightly
      lanceRef.current.position.y = 3.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  const materialProps = {
    color: mode === 'result' ? '#ef4444' : (mode === 'mesh' ? '#4ade80' : '#60a5fa'),
    wireframe: mode === 'mesh',
    transparent: mode === 'mesh' || mode === 'result',
    opacity: mode === 'mesh' ? 0.5 : (mode === 'result' ? 0.8 : 1),
  };

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Bottom */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[1.5, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial {...materialProps} color={mode === 'result' ? '#b91c1c' : materialProps.color} />
      </mesh>
      {/* Middle */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 2, 32]} />
        <meshStandardMaterial {...materialProps} color={mode === 'result' ? '#ef4444' : materialProps.color} />
      </mesh>
      {/* Top Cone */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.8, 1.5, 1, 32]} />
        <meshStandardMaterial {...materialProps} color={mode === 'result' ? '#f97316' : materialProps.color} />
      </mesh>
      {/* Oxygen Lance */}
      <mesh ref={lanceRef} position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 3, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function HotStove({ mode }: { mode: 'geometry' | 'mesh' | 'result' }) {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((state, delta) => {
    if (mode === 'result') groupRef.current.rotation.y += delta * 0.1;
  });
  const materialProps = {
    color: mode === 'result' ? '#ef4444' : (mode === 'mesh' ? '#4ade80' : '#60a5fa'),
    wireframe: mode === 'mesh',
    transparent: mode === 'mesh' || mode === 'result',
    opacity: mode === 'mesh' ? 0.5 : (mode === 'result' ? 0.8 : 1),
  };
  return (
    <group ref={groupRef} position={[0, -1.5, 0]}>
      {/* Main Body */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 3, 32]} />
        <meshStandardMaterial {...materialProps} color={mode === 'result' ? '#f97316' : materialProps.color} />
      </mesh>
      {/* Dome */}
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial {...materialProps} color={mode === 'result' ? '#ef4444' : materialProps.color} />
      </mesh>
      {/* Pipe */}
      <mesh position={[1.2, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 1, 16]} />
        <meshStandardMaterial {...materialProps} color={mode === 'result' ? '#eab308' : materialProps.color} />
      </mesh>
    </group>
  );
}

function DustFilter({ mode }: { mode: 'geometry' | 'mesh' | 'result' }) {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((state, delta) => {
    if (mode === 'result') groupRef.current.rotation.y += delta * 0.1;
  });
  const materialProps = {
    color: mode === 'result' ? '#a8a29e' : (mode === 'mesh' ? '#4ade80' : '#60a5fa'),
    wireframe: mode === 'mesh',
    transparent: mode === 'mesh' || mode === 'result',
    opacity: mode === 'mesh' ? 0.5 : (mode === 'result' ? 0.8 : 1),
  };
  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Main Box */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[2.5, 2, 1.5]} />
        <meshStandardMaterial {...materialProps} color={mode === 'result' ? '#78716c' : materialProps.color} />
      </mesh>
      {/* Hoppers */}
      <mesh position={[-0.6, 0.25, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.6, 1, 4]} />
        <meshStandardMaterial {...materialProps} color={mode === 'result' ? '#57534e' : materialProps.color} />
      </mesh>
      <mesh position={[0.6, 0.25, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.6, 1, 4]} />
        <meshStandardMaterial {...materialProps} color={mode === 'result' ? '#57534e' : materialProps.color} />
      </mesh>
      {/* Inlet Pipe */}
      <mesh position={[-1.5, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 1, 16]} />
        <meshStandardMaterial {...materialProps} color={mode === 'result' ? '#a8a29e' : materialProps.color} />
      </mesh>
    </group>
  );
}

function OxygenLance({ mode }: { mode: 'geometry' | 'mesh' | 'result' }) {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((state, delta) => {
    if (mode === 'result') {
      groupRef.current.rotation.y += delta * 0.5;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 5) * 0.1;
    }
  });
  const materialProps = {
    color: mode === 'result' ? '#94a3b8' : (mode === 'mesh' ? '#4ade80' : '#60a5fa'),
    wireframe: mode === 'mesh',
    transparent: mode === 'mesh' || mode === 'result',
    opacity: mode === 'mesh' ? 0.5 : (mode === 'result' ? 0.9 : 1),
  };
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main Tube */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 4, 32]} />
        <meshStandardMaterial {...materialProps} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Nozzle Tip */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.4, 32]} />
        <meshStandardMaterial {...materialProps} color={mode === 'result' ? '#ef4444' : materialProps.color} metalness={0.5} />
      </mesh>
      {/* Oxygen Jets (only in result mode) */}
      {mode === 'result' && (
        <group position={[0, -0.8, 0]}>
          {[0, 1, 2, 3].map((i) => (
            <mesh key={i} position={[Math.cos(i * Math.PI / 2) * 0.3, -0.5, Math.sin(i * Math.PI / 2) * 0.3]} rotation={[Math.PI / 8 * Math.cos(i * Math.PI / 2), 0, Math.PI / 8 * Math.sin(i * Math.PI / 2)]}>
              <coneGeometry args={[0.15, 1.5, 16]} />
              <meshBasicMaterial color="#60a5fa" transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

function BottomBlowing({ mode }: { mode: 'geometry' | 'mesh' | 'result' }) {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((state, delta) => {
    if (mode === 'result') groupRef.current.rotation.y += delta * 0.2;
  });
  const materialProps = {
    color: mode === 'result' ? '#b91c1c' : (mode === 'mesh' ? '#4ade80' : '#60a5fa'),
    wireframe: mode === 'mesh',
    transparent: mode === 'mesh' || mode === 'result',
    opacity: mode === 'mesh' ? 0.5 : (mode === 'result' ? 0.8 : 1),
  };
  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Converter Bottom */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[2, 1.5, 1, 32]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>
      {/* Porous Plugs & Bubbles */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * Math.PI * 2) / 6;
        const x = Math.cos(angle) * 0.8;
        const z = Math.sin(angle) * 0.8;
        return (
          <group key={i} position={[x, 0.5, z]}>
            <mesh>
              <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            {mode === 'result' && (
              <mesh position={[0, 1, 0]}>
                <cylinderGeometry args={[0.05, 0.2, 2, 16]} />
                <meshBasicMaterial color="#93c5fd" transparent opacity={0.4} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

interface ThreeViewerProps {
  mode?: 'geometry' | 'mesh' | 'result';
  scenarioType?: 'furnace' | 'converter' | 'heater' | 'filter' | 'lance' | 'bottom' | 'default';
}

export function ThreeViewer({ mode = 'geometry', scenarioType = 'default' }: ThreeViewerProps) {
  return (
    <div className="h-full w-full bg-zinc-950 relative overflow-hidden rounded-lg border border-white/10">
      <Canvas camera={{ position: [4, 4, 4], fov: 45 }}>
        <color attach="background" args={['#09090b']} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Center>
          {scenarioType === 'furnace' && <BlastFurnace mode={mode} />}
          {scenarioType === 'converter' && <Converter mode={mode} />}
          {scenarioType === 'heater' && <HotStove mode={mode} />}
          {scenarioType === 'filter' && <DustFilter mode={mode} />}
          {scenarioType === 'lance' && <OxygenLance mode={mode} />}
          {scenarioType === 'bottom' && <BottomBlowing mode={mode} />}
          {scenarioType === 'default' && <DefaultBox position={[0, 0, 0]} mode={mode} />}
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
