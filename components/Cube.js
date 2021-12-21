import { Canvas, useFrame } from '@react-three/fiber'
import { useRef} from 'react'

function Box(props) {
  
  const ref = useRef()
  
  useFrame((state, delta) => ((ref.current.rotation.x += 0.01)))
  useFrame((state, delta) => (ref.current.rotation.y += 0.01))
  
  return (
    <mesh
      {...props}
      ref={ref}
      scale={1}
      >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={"orange"}/>
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Box position={[0, 2, 0]} />
      
    </Canvas>
  )
}
