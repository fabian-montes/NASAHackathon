// MeetOurTeamSection.jsx
import React from 'react';
import ProfileCard from './ProfileCard'; // Assuming ProfileCard is in the same directory
import '../css/MeetOurTeamSection.css'; // For basic styling if you want

import planetA from '../assets/planetA.jpg';
import planetB from '../assets/planetB.jpg';
import planetC from '../assets/planetC.jpg';
import planetD from '../assets/planetD.jpg';

// import aylinFile from './assets/aylin.jpg';
// import karlaFile from './assets/karla.jpg';
// import adyleneFile from './assets/adylene.jpg';
// import blancaFile from './assets/blanca.jpg';
import fabianFile from '../assets/fabian.png';
// import juanFile from './assets/juan.jpg';

const teamMembers = [
  {
    name: "Aylin Ximena Ocampo Vera",
    backgroundFile: planetD,
    mainImageFile: fabianFile
  },
  {
    name: "Karla Irais De Florencio Romero",
    backgroundFile: planetB,
    mainImageFile: fabianFile
  },
  {
    name: "Adylene Baylon Cuahutlapantzi",
    backgroundFile: planetA,
    mainImageFile: fabianFile
  },
  {
    name: "Blanca Flor Visca Cocotzin",
    backgroundFile: planetB,
    mainImageFile: fabianFile
  },
  {
    name: "Fabián Márquez Montes",
    backgroundFile: planetC,
    mainImageFile: fabianFile
  },
  {
    name: "Juan Diego Vázquez Cabrera",
    backgroundFile: planetA,
    mainImageFile: fabianFile
  },
];

const MeetOurTeamSection = () => {
  return (
    <div className="meet-our-team-container">
      <h1>Nuestro Equipo</h1>
      <div className="profile-cards-grid">
        {teamMembers.map((member, index) => (
          <ProfileCard
            key={index}
            name={member.name}
            backgroundFile={member.backgroundFile}
            mainImageFile={member.mainImageFile}
          />
        ))}
      </div>
    </div>
  );
};

export default MeetOurTeamSection;