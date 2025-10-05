import React from 'react';
import { Link } from 'react-router-dom';

import '../css/NavBar.css';

function NavBar() {
  return (
    <nav className='navbar'>
      <div className='logo'>
        My logo
      </div>
      <ul className='nav-links'>
        <li>
          {/* Navigates to the path defined by 'to' */}
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/About">About Us</Link>
        </li>
        <li>
          <Link to="/SolarSystem">Solar System</Link>
        </li>
        <li>
          <Link to="/PlanetTemplate">Planetas</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;