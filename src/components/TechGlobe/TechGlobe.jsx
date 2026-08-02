/**
 * TechGlobe
 * Globo 3D interactivo construido con React Three Fiber.
 * Renderiza la esfera digital + nodos orbitales + partículas.
 *
 * Props:
 *  - technologies: Array de objetos de tecnología con posiciones pre-calculadas
 *  - selectedTech:  tecnología actualmente seleccionada (id) o null
 *  - onSelectTech:  callback(tech | null) al hacer click en un nodo
 *  - reducedMotion: boolean – desactiva animaciones si true
 */

import { useRef, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { getDeviconUrl } from '../../data/globeTechStack';

/* ─────────────────────────────────────────
   Globe Mesh — esfera digital con wireframe + glow
───────────────────────────────────────── */
function GlobeMesh({ reducedMotion }) {
  const meshRef = useRef();
  const wireRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();

  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const t = clock.getElapsedTime();

    if (meshRef.current) meshRef.current.rotation.y = t * 0.06;
    if (wireRef.current)  wireRef.current.rotation.y  = t * 0.06;
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.12;
    if (ring2Ref.current) ring2Ref.current.rotation.x = t * 0.09;
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = -t * 0.07;
      ring3Ref.current.rotation.x = Math.sin(t * 0.3) * 0.3;
    }
  });

  return (
    <group>
      {/* Core sphere — charcoal metallic */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.35, 48, 48]} />
        <meshStandardMaterial
          color="#090d18"
          roughness={0.55}
          metalness={0.7}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Wireframe grid overlay */}
      <mesh ref={wireRef}>
        <sphereGeometry args={[1.36, 20, 20]} />
        <meshBasicMaterial
          color="#1e4a8c"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Energy ring 1 — horizontal */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.55, 0.008, 6, 120]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.35} />
      </mesh>

      {/* Energy ring 2 — tilted */}
      <mesh ref={ring2Ref} rotation={[0.8, 0.4, 0]}>
        <torusGeometry args={[1.6, 0.005, 6, 120]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.2} />
      </mesh>

      {/* Energy ring 3 — animated orbit */}
      <mesh ref={ring3Ref} rotation={[0.3, 0, 0.7]}>
        <torusGeometry args={[1.65, 0.004, 6, 120]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.15} />
      </mesh>

      {/* Rim glow — point light at center for Fresnel-like edge */}
      <pointLight color="#3b82f6" intensity={1.8} distance={4} decay={2} />
    </group>
  );
}

/* ─────────────────────────────────────────
   Particles — puntos ambientales alrededor del globo
───────────────────────────────────────── */

/** Posiciones pre-generadas a nivel de módulo — evita Math.random() en render */
const PARTICLE_COUNT = 90;
const _particlePositions = (() => {
  const arr = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const r = 3.2 + (i / PARTICLE_COUNT) * 1.2; // determinístico
    const theta = (i * 2.399963) % (Math.PI * 2); // ángulo dorado
    const phi = Math.acos(1 - 2 * ((i + 0.5) / PARTICLE_COUNT));
    arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.cos(phi);
    arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  return arr;
})();

function GlobeParticles({ reducedMotion }) {
  const pointsRef = useRef();
  const positions = _particlePositions;

  useFrame(({ clock }) => {
    if (reducedMotion || !pointsRef.current) return;
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.018;
    pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.04) * 0.06;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#60a5fa"
        size={0.03}
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

/* ─────────────────────────────────────────
   TechNode — nodo HTML flotante en el espacio 3D
───────────────────────────────────────── */
function TechNode({ tech, selectedId, onSelect, reducedMotion }) {
  const groupRef = useRef();
  const isActive = selectedId === tech.id;

  // Posición inicial fija calculada desde los datos
  const basePos = useMemo(
    () => new THREE.Vector3(tech._x, tech._y, tech._z),
    [tech._x, tech._y, tech._z]
  );

  // Ángulo orbital base de este nodo
  const orbitAngle = useRef(tech._theta ?? 0);

  // Velocidades orbitales por anillo (más cercano = más rápido)
  const orbitSpeeds = [0.18, 0.11, 0.07];
  // floatOffset es determinístico por índice — evita Math.random() en render
  const floatOffset = (tech._theta ?? 0) * 1.618;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    if (!reducedMotion) {
      // Orbital rotation around Y axis
      const speed = orbitSpeeds[tech.orbit] ?? 0.08;
      orbitAngle.current += 0.016 * speed;

      const r = tech._radius;
      const phi = tech._phi;
      const angle = orbitAngle.current;

      groupRef.current.position.set(
        r * Math.sin(phi) * Math.cos(angle),
        tech._y + Math.sin(t * 0.9 + floatOffset) * 0.06,
        r * Math.sin(phi) * Math.sin(angle)
      );
    } else {
      groupRef.current.position.copy(basePos);
    }
  });

  const handleClick = useCallback(() => {
    onSelect(isActive ? null : tech);
  }, [isActive, tech, onSelect]);

  return (
    <group ref={groupRef} position={[basePos.x, basePos.y, basePos.z]}>
      <Html
        center
        distanceFactor={6}
        zIndexRange={[10, 0]}
        occlude={false}
        style={{ pointerEvents: 'auto' }}
      >
        <div
          className={[
            'tech-node-badge',
            tech.isCore ? 'tech-node-badge--core' : '',
            isActive ? 'tech-node-badge--active' : '',
          ].join(' ')}
          onClick={handleClick}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
          role="button"
          tabIndex={0}
          aria-pressed={isActive}
          aria-label={tech.nameKey}
          title={tech.nameKey}
        >
          <img
            src={getDeviconUrl(tech.devicon)}
            alt=""
            loading="lazy"
            draggable={false}
          />
          <span className="tech-node-label">{tech.nameKey.split('.').pop()}</span>
        </div>
      </Html>
    </group>
  );
}

/* ─────────────────────────────────────────
   Scene — la escena Three.js completa
───────────────────────────────────────── */
function Scene({ technologies, selectedId, onSelectTech, reducedMotion }) {
  const { gl } = useThree();

  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, [gl]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.25} color="#e8f0ff" />
      <directionalLight position={[5, 5, 5]} intensity={0.4} color="#ffffff" />
      <pointLight position={[-4, 3, -4]} intensity={0.6} color="#3b82f6" distance={10} />
      <pointLight position={[4, -2, 4]}  intensity={0.4} color="#67e8f9" distance={8} />

      {/* Globe */}
      <GlobeMesh reducedMotion={reducedMotion} />

      {/* Particles */}
      <GlobeParticles reducedMotion={reducedMotion} />

      {/* Tech nodes */}
      {technologies.map((tech) => (
        <TechNode
          key={tech.id}
          tech={tech}
          selectedId={selectedId}
          onSelect={onSelectTech}
          reducedMotion={reducedMotion}
        />
      ))}

      {/* Controls — auto-rotate when idle, drag to override */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.6}
        rotateSpeed={0.55}
        dampingFactor={0.08}
        enableDamping
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
      />
    </>
  );
}

/* ─────────────────────────────────────────
   TechGlobe — root exported component
───────────────────────────────────────── */
function TechGlobe({ technologies, selectedTech, onSelectTech, reducedMotion }) {
  return (
    <div
      className="tech-globe-canvas-wrapper"
      role="img"
      aria-label="Interactive technology ecosystem globe"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        frameloop={reducedMotion ? 'never' : 'always'}
        style={{ width: '100%', height: '100%', borderRadius: '50%' }}
        dpr={[1, 2]}
      >
        <Scene
          technologies={technologies}
          selectedId={selectedTech?.id ?? null}
          onSelectTech={onSelectTech}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
}

export default TechGlobe;
