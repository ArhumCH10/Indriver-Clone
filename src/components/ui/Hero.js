import React from 'react';
import '../styles/style.css';

function Hero() {
  return (
    <section className="hero has-bg-image" aria-label="home" style={{ backgroundImage: "url('./assets/images/hero-bg.jpg')" }}>
      <div className="container">
        <div className="hero-content">
          <p className="section-subtitle :dark">We have talented engineers & mechanics</p>
          <h1 className="h1 section-title">Auto Maintenance & Car Booking System</h1>
          <p className="section-text">We provide excellent service and ensure customer satisfaction. Our team is dedicated to delivering top-notch auto maintenance and car booking services.</p>
          <a href="#" className="btn">
            <span className="span">Our Services</span>
            <span className="material-symbols-rounded">arrow_forward</span>
          </a>
        </div>
        <figure className="hero-banner">
          <img src="./assets/images/hero-banner.png" alt="red motor vehicle" className="move-anim" />
        </figure>
      </div>
    </section>
  );
}

export default Hero;