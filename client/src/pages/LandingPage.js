import React from 'react';

function LandingPage({ onStart }) {
  return (
    <>
      <div className="animated-bg">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>
      
      <div className="landing-container">
        <div className="landing-hero">
          <h1 className="landing-title">KRITICAL</h1>
          <p className="landing-subtitle">⛏️ Casa 13hs - Mining Platform</p>
          
          <p className="landing-description">
            Mina tokens KRT en la red BNB con nuestro sistema revolucionario.
            Ciclos de 12 horas, staking de 12% APY y sistema de referidos con bonus del 10%.
          </p>

          <div className="landing-features">
            <div className="feature-box">
              <div className="feature-icon">⛏️</div>
              <div className="feature-title">Minería</div>
              <div className="feature-text">Ciclos cada 12 horas sin límites</div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">💰</div>
              <div className="feature-title">Staking</div>
              <div className="feature-text">Gana 12% APY con tus tokens</div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">🤝</div>
              <div className="feature-title">Referidos</div>
              <div className="feature-text">Obtén 10% de bonus por referencia</div>
            </div>
            <div className="feature-box">
              <div className="feature-icon">🔒</div>
              <div className="feature-title">Seguro</div>
              <div className="feature-text">Tokens permanentes en wallet</div>
            </div>
          </div>

          <button className="landing-btn-start" onClick={onStart}>
            Comenzar Ahora →
          </button>
        </div>
      </div>
    </>
  );
}

export default LandingPage;