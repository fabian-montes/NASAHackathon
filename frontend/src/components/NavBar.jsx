import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
      <ul>
        <li>
          {/* Navigates to the path defined by 'to' */}
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About Us</Link>
        </li>
        <li>
          <Link to="/PlanetTemplate">Planetas</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;