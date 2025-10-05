// AboutProjectSection.jsx
import React from 'react';
import '../css/AboutProjectSection.css'; // Importa el CSS

const AboutProjectSection = () => {
  const description = `
    Our project is a web platform that lets users explore the Solar System.
    Users start with a 3D model of the whole system and can select each
    planet individually. For every planet, they can rotate and zoom the 3D
    model, listen to audio narration with key facts, and interact with a
    chatbot that answers questions about that planet. For Earth, users can
    also access images taken by satellites orbiting the planet. These images
    can be zoomed in deeply to see details captured from space, giving a
    more interactive and realistic experience. The project uses space data
    and modern web technologies to create this interactive experience. It
    addresses the “Embiggen Your Eyes” challenge by helping users see and
    understand space data in more detail. Combining 3D exploration, narration,
    satellite images, and a chatbot, the platform offers an educational and
    interactive way to learn about the Solar System.
  `;

  return (
    <section className="about-project-container">
      <h2>About this project</h2>
      <p className="project-description">{description.trim()}</p>
    </section>
  );
};

export default AboutProjectSection;