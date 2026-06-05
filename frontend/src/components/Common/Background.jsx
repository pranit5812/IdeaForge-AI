import React from 'react';
import doodleBackground from '../../assets/pastel_doodle_background.svg';

const Background = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-[#FFFAF3]"
      style={{
        backgroundImage: `url(${doodleBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
};

export default Background;
