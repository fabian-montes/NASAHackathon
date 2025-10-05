import React from 'react';
import SpinningSphere from './SpinningSphere';

import '../css/Home.css';
// import earthTexture from '../assets/planetA.jpg'; 
import earthTexture from '../assets/fabian.png'; 

function Home() {
  return (
    <div className="sphere-container">
      {/* Assuming your image is at /public/images/my-texture.jpg */}
      <SpinningSphere 
        imageUrl={earthTexture}
        spinSpeed={0.005} // Slower spin
        size={2} 
        canvasClassName="full-size-canvas"
      />
    </div>
  );
}

export default Home;