import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import PlanetTemplate from './components/PlanetTemplate';
import Satelite from './components/Satelite';
// import Contact from './components/Contact';
import NavBar from './components/NavBar';

function App() {
  return (
    <>
      <NavBar/> {/* Navigation links go here */}
      {/* Defines the area where routes will be rendered */}
      <Routes>
        <Route path="/" element={<Home/>} /> 
        <Route path="/about" element={<About/>} />
        <Route path="/PlanetTemplate" element={<PlanetTemplate/>} />
          <Route path="/Satelite" element={<Satelite/>} />
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </>
  );
}


export default App;