import React from 'react';
import ProfileCard from './ProfileCard';
import MeetOurTeamSection from './MeetOurTeamSection';
import AboutProjectSection from './AboutProjectSection';

import '../css/estrellas.css'

function About() {
  return (
    <>
      <h1>Nosotros</h1>
      <MeetOurTeamSection/>
      <AboutProjectSection/>
    </>
  );
}

export default About;