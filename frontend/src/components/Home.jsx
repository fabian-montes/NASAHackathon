import { React, useState } from 'react';
import SpinningSphere from './SpinningSphere';
import SplashScreen from "./SplashScreen";

import '../css/Home.css';
// import earthTexture from '../assets/planetA.jpg'; 
import earthTexture from '../assets/earth.jpg'; 
import satelliteTexture from '../assets/satellite.jpg';

function Home() {
  const systemConfig = [
    { 
      imageUrl: satelliteTexture,
      radius: 6,      // Closest orbit
      speed: 0.01, 
      direction: 1,   // Counter-clockwise
      size: 0.3 
    },
    { 
      imageUrl: satelliteTexture,
      radius: 7,     // Middle orbit
      speed: 0.005, 
      direction: -1,  // Clockwise (retrograde motion)
      size: 0.5
    },
    { 
      imageUrl: satelliteTexture,
      radius: 10,     // Farthest orbit
      speed: 0.002, 
      direction: 1, 
      size: 0.4
    },
  ];

  const [showSplash, setShowSplash] = useState(false);

  return (
    <div className="sphere-container">
      {showSplash && <SplashScreen onClose={() => setShowSplash(false)} />}
      {!showSplash && <SpinningSphere
        imageUrl={earthTexture}
        orbitConfigs={systemConfig}
        spinSpeed={0.005} // Slower spin
        size={3} 
        canvasClassName="full-size-canvas"
        setShowSplash={setShowSplash}
      /> }
    </div>
  );
}

export default Home;