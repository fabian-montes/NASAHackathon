// MeetOurTeamSection.jsx
import React from 'react';
import ProfileCard from './ProfileCard'; // Assuming ProfileCard is in the same directory
import '../css/MeetOurTeamSection.css'; // For basic styling if you want

import planetA from '../assets/planetA.jpg';
import planetB from '../assets/planetB.jpg';
import planetC from '../assets/planetC.jpg';
import planetD from '../assets/planetD.jpg';

import aylinFile from '../assets/aylin.png';
import karlaFile from '../assets/karla.png';
import adyFile from '../assets/ady.png';
import blancaFile from '../assets/blanca.png';
import fabianFile from '../assets/fabian.png';
import juanFile from '../assets/juan.png';

const teamMembers = [
  {
    name: "Aylin Ximena Ocampo Vera",
    backgroundFile: planetD,
    mainImageFile: aylinFile
  },
  {
    name: "Karla Irais De Florencio Romero",
    backgroundFile: planetB,
    mainImageFile: karlaFile
  },
  {
    name: "Adylene Baylon Cuahutlapantzi",
    backgroundFile: planetA,
    mainImageFile: adyFile
  },
  {
    name: "Blanca Flor Visca Cocotzin",
    backgroundFile: planetB,
    mainImageFile: blancaFile
  },
  {
    name: "Fabián Márquez Montes",
    backgroundFile: planetC,
    mainImageFile: fabianFile
  },
  {
    name: "Juan Diego Vázquez Cabrera",
    backgroundFile: planetA,
    mainImageFile: juanFile
  },
];

const MeetOurTeamSection = () => {
  return (
    <div className="meet-our-team-container">
      <h1>Our Teammates</h1>
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