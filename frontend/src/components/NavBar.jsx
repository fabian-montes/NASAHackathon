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
          <Link to="/about">About Us</Link>
        </li>

        <li className="has-submenu">
          {/* Link principal a la vista general de Planetas */}
          <Link to="/PlanetTemplate" className="submenu-toggle" aria-haspopup="true" aria-expanded="false">
            Planetas
          </Link>

          {/* Submenú */}
          <ul className="submenu" role="menu">
            <li role="none"><Link role="menuitem" to="/PlanetTemplate" state={{ planetKey: 'jupiter' }}>Júpiter</Link></li>
            <li role="none"><Link role="menuitem" to="/PlanetTemplate" state={{ planetKey: 'mars' }}>Marte</Link></li>
            <li role="none"><Link role="menuitem" to="/PlanetTemplate" state={{ planetKey: 'saturn' }}>Saturno</Link></li>
            <li role="none"><Link role="menuitem" to="/PlanetTemplate" state={{ planetKey: 'mercury' }}>Mercurio</Link></li>
            <li role="none"><Link role="menuitem" to="/PlanetTemplate" state={{ planetKey: 'venus' }}>Venus</Link></li>
            <li role="none"><Link role="menuitem" to="/PlanetTemplate" state={{ planetKey: 'earth' }}>Tierra</Link></li>
            <li role="none"><Link role="menuitem" to="/PlanetTemplate" state={{ planetKey: 'uranus' }}>Urano</Link></li>
            <li role="none"><Link role="menuitem" to="/PlanetTemplate" state={{ planetKey: 'neptune' }}>Neptuno</Link></li>
          </ul>
        </li>

        <li>
          <Link to="/Satelite">Satelite</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;