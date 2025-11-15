import { useRef, useMemo } from 'react'
import { useFrame, Canvas } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Компонент частиц должен быть внутри Canvas
function FloatingParticles({ count = 1000, corruptionLevel = 0 }) {
  const points = useRef()
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    
    return positions
  }, [count])

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.x = state.clock.elapsedTime * 0.1
      points.current.rotation.y = state.clock.elapsedTime * 0.05
      
      // Эффект коррупции влияет на частицы
      const positions = points.current.geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        if (Math.random() < corruptionLevel * 0.1) {
          positions[i * 3] += (Math.random() - 0.5) * 0.1
          positions[i * 3 + 1] += (Math.random() - 0.5) * 0.1
        }
      }
      points.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <Points ref={points} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00ff00"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3 + corruptionLevel * 0.2}
      />
    </Points>
  )
}

// Основной компонент фона
export default function ThreeJSBackground({ corruptionLevel = 0 }) {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      zIndex: 0,
      opacity: 0.1 + corruptionLevel * 0.3
    }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        {/* Исправлено: color -> Color, ambientLight -> AmbientLight */}
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.5} />
        <FloatingParticles corruptionLevel={corruptionLevel} />
      </Canvas>
    </div>
  )
}