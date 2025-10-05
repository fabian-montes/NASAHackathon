import React from 'react';
import SpinningSphere from './SpinningSphere';

import '../css/Home.css';
// import earthTexture from '../assets/planetA.jpg'; 
import earthTexture from '../assets/fabian.png'; 
import moonTexture from '../assets/planetA.jpg';
import SolarSystem from './SolarSystem';

function Home() {
  return (
    <div className="sphere-container">
      {/* Assuming your image is at /public/images/my-texture.jpg */}
      <SolarSystem/>
      {/* <SpinningSphere 
        imageUrl={earthTexture}
        orbitImageUrl={moonTexture}
        spinSpeed={0.005} // Slower spin
        size={3} 
        canvasClassName="full-size-canvas"
      /> */}
    </div>
  );
}

export default Home;