import { useEffect, useState } from 'react';
import './Mascot.css';

function Mascot() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`mascot-wrapper ${visible ? 'mascot-visible' : ''}`}>
      <div className="mascot-body">
        <img
          src="/Copilot_20251024_111130.png"
          alt="NeuroNest Mascot"
          className="mascot-img"
        />

        {/* 👋 Waving Hand Overlay */}
        <div className="mascot-hand" />

        {/* 👁️ Blinking Eyes Overlay */}
        <div className="mascot-eye left-eye" />
        <div className="mascot-eye right-eye" />
      </div>
    </div>
  );
}

export default Mascot;
