import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import PlanetTemplate from './components/PlanetTemplate';
import Satelite from './components/Satelite';
// import Contact from './components/Contact';
import NavBar from './components/NavBar';
// import SolarContainer from './components/SolarContainer';
import SolarSystem from './components/SolarSystem';

function App() {
  return (
    <>
      <NavBar/> {/* Navigation links go here */}
      {/* Defines the area where routes will be rendered */}
      <Routes>
        <Route path="/" element={<Home/>} /> 
        <Route path="/About" element={<About/>} />
        <Route path="/SolarSystem" element={<SolarSystem/>} />
        <Route path="/PlanetTemplate" element={<PlanetTemplate/>} />
        <Route path="/Satelite" element={<Satelite/>} />
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </>
  );
}


export default App;