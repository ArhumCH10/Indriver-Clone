import React from 'react';

function About() {
  return (
    <section className="section about has-before" aria-labelledby="about-label">
      <div className="container">
        <figure className="about-banner">
          <img src="./assets/images/about-abs-banner.png" width="1040" height="840" loading="lazy" alt="vehicle repair equipment" className="w-100" />
        </figure>
        <div className="about-content">
          <p className="section-subtitle :dark">About Us</p>
          <h2 className="h2 section-title">We’re Committed to Meet the quality</h2>
          <p className="section-text">
            Quis autem vel eum iure reprehenderit qui in ea volu velit esse quam nihil molestiae consequatur, vel illum eui dolorem eum fugiat ruo.
          </p>
          <p className="section-text">
            Reprehenderit qui in ea volu velit esse quam nihil molestiae consequatur, vel illum eui.
          </p>
          <ul className="about-list">
            {[
              { title: "8K+", description: "Happy Clients" },
              { title: "22+", description: "Instruments" },
              { title: "50+", description: "Years in market" },
              { title: "99%", description: "Projects completed" }
            ].map(item => (
              <li key={item.title} className="about-item">
                <p><strong className="display-1 strong">{item.title}</strong> {item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default About;
