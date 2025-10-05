// MeetOurTeamSection.jsx
import React from 'react';
import ProfileCard from './ProfileCard'; // Assuming ProfileCard is in the same directory
import '../css/MeetOurTeamSection.css'; // For basic styling if you want

const teamMembers = [
  {
    name: "Aylin Ximena Ocampo Vera",
    backgroundFile: "path/to/aylin-background.png",
    mainImageFile: "path/to/aylin-silhouette.png",
  },
  {
    name: "Karla Irais De Florencio Romero",
    backgroundFile: "path/to/karla-background.png",
    mainImageFile: "path/to/karla-silhouette.png",
  },
  {
    name: "Adylene Baylon Cuahutlapantzi",
    backgroundFile: "path/to/adylene-background.png",
    mainImageFile: "path/to/adylene-silhouette.png",
  },
  {
    name: "Blanca Flor Visca Cocotzin",
    backgroundFile: "path/to/blanca-background.png",
    mainImageFile: "path/to/blanca-silhouette.png",
  },
  {
    name: "Fabián Márquez Montes",
    backgroundFile: "path/to/fabian-background.png",
    mainImageFile: "path/to/fabian-silhouette.png",
  },
  {
    name: "Juan Diego Vázquez Cabrera",
    backgroundFile: "path/to/juan-diego-background.png",
    mainImageFile: "path/to/juan-diego-silhouette.png",
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