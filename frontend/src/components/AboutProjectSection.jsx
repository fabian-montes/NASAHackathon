// AboutProjectSection.jsx
import React from 'react';
import '../css/AboutProjectSection.css'; // Importa el CSS

const AboutProjectSection = () => {
  const description = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
    eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
    sunt in culpa qui officia deserunt mollit anim id est laborum.
  `;

  return (
    <section className="about-project-container">
      <h2>Acerca de Este Proyecto</h2>
      <p className="project-description">{description.trim()}</p>
    </section>
  );
};

export default AboutProjectSection;