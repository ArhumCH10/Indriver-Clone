import React from 'react';
import '../styles/style.css';

function ServiceCard({ imgSrc, title, description }) {
  return (
    <li>
      <div className="service-card">
        <figure className="card-icon">
          <img src={imgSrc} width="110" height="110" loading="lazy" alt={title} />
        </figure>
        <h3 className="h3 card-title">{title}</h3>
        <p className="card-text">{description}</p>
        <a href="#" className="btn-link">Read more</a>
      </div>
    </li>
  );
}

function Services() {
  const services = [
    { imgSrc: "./assets/images/services-1.png", title: "Engine Repair", description: "We offer comprehensive engine repair services to keep your vehicle running smoothly." },
    { imgSrc: "./assets/images/services-2.png", title: "Brake Repair", description: "Our expert technicians provide top-quality brake repair services for your safety." },
    { imgSrc: "./assets/images/services-3.png", title: "Tire Repair", description: "Professional tire repair services to ensure your vehicle's optimal performance." },
    { imgSrc: "./assets/images/services-4.png", title: "Battery Repair", description: "Reliable battery repair services to keep your vehicle powered up." },
  ];

  return (
    <section className="section service has-bg-image" aria-labelledby="service-label" style={{ backgroundImage: "url('./assets/images/service-bg.jpg')" }}>
      <div className="container">
        <p className="section-subtitle :light" id="service-label">Our services</p>
        <h2 className="h2 section-title">We Provide Great Services For Your Vehicle</h2>
        <ul className="service-list">
          {services.map(service => (
            <ServiceCard key={service.title} {...service} />
          ))}
          <li className="service-banner">
            <img src="./assets/images/services-5.png" width="646" height="380" loading="lazy" alt="Red Car" className="move-anim" />
          </li>
        </ul>
        <a href="#" className="btn">
          <span className="span">View All Services</span>
          <span className="material-symbols-rounded">arrow_forward</span>
        </a>
      </div>
    </section>
  );
}

export default Services;