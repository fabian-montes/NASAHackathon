import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// A function to be passed down as a prop to handle the selection logic
const handleSphereClick = (event, id) => {
    // Stop event propagation so clicking the small sphere doesn't also click the large one
    event.stopPropagation(); 
    
    // The 'id' allows you to uniquely identify which sphere was clicked
    console.log(`Sphere Selected: ${id}`);
    
    // In a real app, you would update a React state here:
    // setSelectedSphere(id);
};
/**
 * Renders a 3D sphere with a custom texture that spins.
 *
 * @param {object} props
 * @param {string} props.imageUrl - Path to the 2D image texture.
 * @param {number} [props.spinSpeed=0.01] - Speed of rotation around the Y-axis.
 * @param {number} [props.size=3] - Radius of the sphere.
 */
function SphereWithTexture({ imageUrl, spinSpeed = 0.01, size = 3, onSelect }) {
  // Use a ref to access the 3D mesh object
  const meshRef = useRef();

  // Load the 2D image as a texture
  const colorMap = useTexture(imageUrl);

  // useFrame is a hook that runs before each frame is rendered.
  useFrame(() => {
    if (meshRef.current) {
      // Rotate the main sphere around the vertical (Y) axis
      meshRef.current.rotation.y += spinSpeed;
    }
  });

  return (
    // <mesh> is the base 3D object
    <mesh ref={meshRef} onClick={(e) => onSelect(e, 'Main_Sphere')}>
      {/* <sphereGeometry> defines the shape (a sphere) */}
      <sphereGeometry args={[size, 64, 64]} /> 
      {/* <meshStandardMaterial> defines the material, accepting the loaded texture */}
      <meshStandardMaterial 
        map={colorMap} 
        metalness={0.5} // Optional: for a slightly metallic look
        roughness={0.7} // Optional: for a non-shiny surface
      />
    </mesh>
  );
}

// ----------------------------------------------------------------------
// NEW COMPONENT: OrbitingSphere
// ----------------------------------------------------------------------

/**
 * Renders a smaller sphere with a custom texture that spins and orbits.
 *
 * @param {object} props
 * @param {string} props.imageUrl - Path to the 2D image texture.
 * @param {number} [props.spinSpeed=0.03] - Speed of rotation around its own Y-axis.
 * @param {number} [props.size=0.8] - Radius of the sphere.
 * @param {number} [props.orbitRadius=6] - Distance from the center of the orbit.
 * @param {number} [props.orbitSpeed=0.005] - Speed of the orbit.
 */
function OrbitingSphere({ 
  imageUrl, 
  spinSpeed = 0.03, 
  size = 0.8,
  orbitRadius = 6,
  orbitSpeed = 0.005,
  direction = 1,
  id,
  onSelect
}) {
  const meshRef = useRef();
  const colorMap = useTexture(imageUrl);

  // Use a ref to store the current orbital angle (theta)
  // const angle = useRef(0);
  const angle = useRef(Math.random() * Math.PI * 2); // Start at a random angle to spread them out

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // 1. **Orbit Calculation**
      // Increase the angle based on the orbit speed
      angle.current += orbitSpeed * direction;
      
      // 2. **Self-Rotation (Spin)**
      // meshRef.current.rotation.y += spinSpeed;
      const x = orbitRadius * Math.cos(angle.current);
      const z = orbitRadius * Math.sin(angle.current);

      // Apply the new position
      meshRef.current.position.x = x;
      meshRef.current.position.z = z;

      // 2. **Self-Rotation** (Optional, but good for planets)
      meshRef.current.rotation.y += 0.03; 
    }
  });

  return (
    <mesh ref={meshRef} onClick={(e) => onSelect(e, id)}>
      <sphereGeometry args={[size, 32, 32]} /> 
      <meshStandardMaterial 
        map={colorMap} 
        metalness={0.3}
        roughness={0.9} 
      />
    </mesh>
  );
}

// ----------------------------------------------------------------------
// MAIN COMPONENT (SpinningSphere)
// ----------------------------------------------------------------------

/**
 * The main component to set up the 3D scene (Canvas, lights, and camera controls).
 *
 * @param {object} props
 * @param {string} props.imageUrl - Path to the main sphere's texture.
 * @param {string} props.orbitImageUrl - Path to the orbiting sphere's texture. // NEW PROP
 * @param {number} [props.spinSpeed] - Speed of rotation.
 * @param {number} [props.size] - Radius of the sphere.
 * @param {string} [props.canvasClassName] - Optional class for the canvas container.
 */
export default function SpinningSphere({ 
  imageUrl, 
  orbitConfigs = [], // New prop for the orbiting sphere's texture
  spinSpeed, 
  size,
  canvasClassName,
  setShowSplash
}) {

  // 1. Define the handler function
  const handleSphereSelection = (event, id) => {
      event.stopPropagation(); // Prevents clicks from triggering on parent elements
      console.log(`⭐ Sphere Selected: ${id}`);
      setShowSplash(true);
      // You could manage the selected state here:
      // const [selectedId, setSelectedId] = useState(null);
      // setSelectedId(id);
  };

  return (
    // <Canvas> is the main entry point for R3F, creating a WebGL context.
    <Canvas className={canvasClassName}>
      {/* Lights are essential for a non-Basic material to be visible */}
      <ambientLight intensity={2.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      
      {/* OrbitControls allows the user to rotate, pan, and zoom the scene */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true} 
      />

      {/* Suspense fallback while the texture is loading */}
      <Suspense fallback={null}>
        {/* The Main Sphere */}
        <SphereWithTexture 
          imageUrl={imageUrl} 
          spinSpeed={spinSpeed} 
          size={size} 
          onSelect={handleSphereSelection}
        />
        
        {/* The Orbiting Sphere (The 'moon') */}
        {/* It is placed at the origin (0,0,0) of its parent, which is the center of the scene.
            Its movement is handled internally by its useFrame hook. */}
        {/* Render all orbiting spheres using the provided array */}
        {orbitConfigs.map((config, index) => (
          <OrbitingSphere 
            key={index} // Use index as a key (safe here since the array order won't change)
            id={config.name || `Satellite_${index}`} // Use a name from config or a default ID
            onSelect={handleSphereSelection} // Pass handler
            imageUrl={config.imageUrl}
            orbitRadius={config.radius} // Map 'radius' from config to 'orbitRadius' prop
            orbitSpeed={config.speed}   // Map 'speed' from config to 'orbitSpeed' prop
            direction={config.direction} // Map 'direction' from config
            size={config.size}         // Optional size
          />
        ))}
      </Suspense>
    </Canvas>
  );
}