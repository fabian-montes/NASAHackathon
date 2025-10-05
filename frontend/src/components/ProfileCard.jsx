import React from 'react';
import '../css/ProfileCard.css';

const ProfileCard = ({ name, backgroundFile, mainImageFile }) => {
  return (
    <div className="profile-card">
      <div className="profile-image-wrapper" style={{ backgroundImage: `url(${backgroundFile})` }}>
        {/* The main image (silhouette) will be layered on top of the background */}
        <img src={mainImageFile} alt={`${name} silhouette`} className="profile-main-image" />
      </div>
      <p className="profile-name">{name}</p>
    </div>
  );
};

export default ProfileCard;