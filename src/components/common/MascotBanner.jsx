import React from 'react';
import './MascotBanner.css';

const MascotBanner = ({ message }) => {
  return (
    <div className="mascot-banner">
      <img
        src="/Copilot_20251024_111130.png"
        alt="Mascot waving"
        className="mascot-image"
        onError={(e) => {
          e.target.src = '/mascot-fallback.png'; 
        }}
      />
      <p className="mascot-message">{message}</p>
    </div>
  );
};

export default MascotBanner;
