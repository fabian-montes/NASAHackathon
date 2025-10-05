import React, { useState } from 'react';
import '../css/ProfileCard.css';

import defaultImage from '../assets/silhouette.png';

const ProfileCard = ({ name, backgroundFile, mainImageFile }) => {
  const [isHovered, setIsHovered] = useState(false);
  const currentImage = isHovered ? mainImageFile : defaultImage;

  return (
    <div 
      className="profile-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="profile-image-wrapper" style={{ backgroundImage: `url(${backgroundFile})` }}>
        {/* The main image (silhouette) will be layered on top of the background */}
        <img 
          src={currentImage} 
          alt={isHovered ? `${name}'s photo` : `${name} silhouette`} 
          className="profile-main-image" 
        />
      </div>
      <p className="profile-name">{name}</p>
    </div>
  );
};

export default ProfileCard;