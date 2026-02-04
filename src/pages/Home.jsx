import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Home.css';
import Mascot from '../components/Mascot'; 

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* 🧠 Carousel Banner */}
      <div className="carousel-wrapper">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={4000}
          transitionTime={600}
          swipeable={false}
          emulateTouch={false}
          stopOnHover={false}
          showArrows={false}
        >
          <div><img src="/Copilot_20251024_095741.png" alt="Banner 1" /></div>
          <div><img src="/Copilot_20251024_101855.png" alt="Banner 2" /></div>
          <div><img src="/Copilot_20251024_102307.png" alt="Banner 3" /></div>
        </Carousel>
      </div>

      {/* ✨ Banner Text */}
      <div className="banner-text">
        <h1>Welcome to NeuroNest</h1>
        <p>Where playful learning meets smart screening</p>
      </div>

      {/* 🎯 Feature Highlights (Only 2 Cards now) */}
      <div className="features">
        <div className="feature-card" onClick={() => navigate('/screening')}>
          📊 Smart Screening
        </div>
        <div className="feature-card" onClick={() => navigate('/games')}>
          🎮 Interactive Games
        </div>
      </div>

      {/* 🎮 CTA Buttons */}
      <div className="cta-buttons">
        <button onClick={() => navigate('/add-child')} className="cta-button">
          ➕ Add Child
        </button>
        <button onClick={() => navigate('/parent-dashboard')} className="cta-button">
          📋 View Dashboard
        </button>
      </div>

      {/* 🧠 Animated Mascot Entry */}
      <Mascot />

      {/* ✨ Footer */}
      <p className="footer-text">🌟 Designed for parents. Backed by science. Loved by kids.</p>
    </div>
  );
}

export default Home;