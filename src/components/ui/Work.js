import React from 'react';

function WorkCard({ imgSrc, title, subtitle }) {
  return (
    <li className="scrollbar-item">
      <div className="work-card">
        <figure className="card-banner img-holder" style={{ width: 350, height: 406 }}>
          <img src={imgSrc} width="350" height="406" loading="lazy" alt={title} className="img-cover" />
        </figure>
        <div className="card-content">
          <p className="card-subtitle">{subtitle}</p>
          <h3 className="h3 card-title">{title}</h3>
          <a href="#" className="card-btn">
            <span className="material-symbols-rounded">arrow_forward</span>
          </a>
        </div>
      </div>
    </li>
  );
}

function Work() {
  const works = [
    { imgSrc: "./assets/images/work-1.jpg", title: "Engine Repair", subtitle: "Auto Repair" },
    { imgSrc: "./assets/images/work-2.jpg", title: "Car Tyre change", subtitle: "Auto Repair" },
    { imgSrc: "./assets/images/work-3.jpg", title: "Battery Adjust", subtitle: "Auto Repair" }
  ];

  return (
    <section className="section work" aria-labelledby="work-label">
      <div className="container">
        <p className="section-subtitle :light" id="work-label">Our Work</p>
        <h2 className="h2 section-title">Latest projects we have done</h2>
        <ul className="has-scrollbar">
          {works.map(work => (
            <WorkCard key={work.title} {...work} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Work;
