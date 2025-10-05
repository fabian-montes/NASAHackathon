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

        <li className="has-submenu">
          {/* Link principal a la vista general de Planetas */}
          <Link to="#" className="submenu-toggle" aria-haspopup="true" aria-expanded="false">
            Planets
          </Link>

          {/* Submenú */}
          <ul className="submenu" role="menu">
            <li role="none"><Link role="menuitem" to="/PlanetTemplate" state={{ planetKey: 'mercury' }}>Mercury</Link></li>
            <li role="none"><Link role="menuitem" to="/PlanetTemplate" state={{ planetKey: 'venus' }}>Venus</Link></li>
            <li role="none"><Link role="menuitem" to="/PlanetTemplate" state={{ planetKey: 'earth' }}>Earth</Link></li>
            <li role="none"><Link role="menuitem" to="/PlanetTemplate" state={{ planetKey: 'mars' }}>Mars</Link></li>
            <li role="none"><Link role="menuitem" to="/PlanetTemplate" state={{ planetKey: 'jupiter' }}>Jupiter</Link></li>
            <li role="none"><Link role="menuitem" to="/PlanetTemplate" state={{ planetKey: 'saturn' }}>Saturn</Link></li>
            <li role="none"><Link role="menuitem" to="/PlanetTemplate" state={{ planetKey: 'uranus' }}>Uranus</Link></li>
            <li role="none"><Link role="menuitem" to="/PlanetTemplate" state={{ planetKey: 'neptune' }}>Neptune</Link></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;