import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, OrbitControls } from '@react-three/drei';

/**
 * Renders a 3D sphere with a custom texture that spins.
 *
 * @param {object} props
 * @param {string} props.imageUrl - Path to the 2D image texture.
 * @param {number} [props.spinSpeed=0.01] - Speed of rotation around the Y-axis.
 * @param {number} [props.size=3] - Radius of the sphere.
 */
function SphereWithTexture({ imageUrl, spinSpeed = 0.01, size = 3 }) {
  // Use a ref to access the 3D mesh object
  const meshRef = useRef();

  // Load the 2D image as a texture
  // useTexture is a helper from @react-three/drei
  const colorMap = useTexture(imageUrl);

  // useFrame is a hook that runs before each frame is rendered,
  // making it perfect for animations.
  useFrame(() => {
    if (meshRef.current) {
      // Rotate the sphere around the vertical (Y) axis
      meshRef.current.rotation.y += spinSpeed;
    }
  });

  return (
    // <mesh> is the base 3D object
    <mesh ref={meshRef}>
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

/**
 * The main component to set up the 3D scene (Canvas, lights, and camera controls).
 *
 * @param {object} props
 * @param {string} props.imageUrl - Path to the 2D image texture.
 * @param {number} [props.spinSpeed] - Speed of rotation.
 * @param {number} [props.size] - Radius of the sphere.
 * @param {string} [props.canvasClassName] - Optional class for the canvas container.
 */
export default function SpinningSphere({ 
  imageUrl, 
  spinSpeed, 
  size,
  canvasClassName 
}) {
  return (
    // <Canvas> is the main entry point for R3F, creating a WebGL context.
    // It's recommended to wrap heavy components in <Suspense> for loading states.
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
        <SphereWithTexture 
          imageUrl={imageUrl} 
          spinSpeed={spinSpeed} 
          size={size} 
        />
      </Suspense>
    </Canvas>
  );
}