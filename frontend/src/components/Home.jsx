import { React, useState } from 'react';
import SpinningSphere from './SpinningSphere';
import SplashScreen from "./SplashScreen";

import '../css/Home.css';
// import earthTexture from '../assets/planetA.jpg'; 
import earthTexture from '../assets/earth.jpg'; 
import moonTexture from '../assets/planetA.jpg';
import satelliteTexture from '../assets/planetB.jpg';
import planetTexture from '../assets/planetC.jpg';

function Home() {
  const systemConfig = [
    { 
      imageUrl: moonTexture,
      radius: 6,      // Closest orbit
      speed: 0.01, 
      direction: 1,   // Counter-clockwise
      size: 0.7 
    },
    { 
      imageUrl: satelliteTexture,
      radius: 10,     // Middle orbit
      speed: 0.005, 
      direction: -1,  // Clockwise (retrograde motion)
      size: 1.2 
    },
    { 
      imageUrl: planetTexture,
      radius: 14,     // Farthest orbit
      speed: 0.002, 
      direction: 1, 
      size: 1.0 
    },
  ];

  const [showSplash, setShowSplash] = useState(true);

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