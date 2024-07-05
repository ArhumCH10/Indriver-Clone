import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top section">
        <div className="container">
          <div className="footer-brand">
            <a href="#" className="logo">
              <img src="./assets/images/Logo.png" width="128" height="63" alt="autofix home" />
            </a>
            <p className="footer-text">
            We provide excellent service and ensure customer satisfaction. Our team is dedicated to delivering top-notch auto maintenance and car booking services.
            </p>
            <ul className="social-list">
              {[
                { src: "./assets/images/facebook.svg", alt: "facebook" },
                { src: "./assets/images/instagram.svg", alt: "instagram" },
                { src: "./assets/images/twitter.svg", alt: "twitter" }
              ].map(item => (
                <li key={item.alt}>
                  <a href="#" className="social-link">
                    <img src={item.src} alt={item.alt} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <ul className="footer-list">
            <li><p className="h3">Opening Hours</p></li>
            {[
              { day: "Monday – Saturday", time: "12.00 – 14.45" },
              { day: "Sunday – Thursday", time: "17.30 – 00.00" },
              { day: "Friday – Saturday", time: "12.00 – 14.45" }
            ].map(item => (
              <li key={item.day}>
                <p className="p">{item.day}</p>
                <span className="span">{item.time}</span>
              </li>
            ))}
          </ul>

          <ul className="footer-list">
            <li><p className="h3">Contact Info</p></li>
            {[
              { href: "tel:+01234567890", icon: "call", text: "+01 2 3456 7890" },
              { href: "mailto:info@autofix.com", icon: "mail", text: "info@autofix.com" }
            ].map(item => (
              <li key={item.text}>
                <a href={item.href} className="footer-link">
                  <span className="material-symbols-rounded">{item.icon}</span>
                  <span className="span">{item.text}</span>
                </a>
              </li>
            ))}
            <li>
              <address className="footer-link address">
                <span className="material-symbols-rounded">location_on</span>
                <span className="span">21 King Street Melbourne, 3000, Australia</span>
              </address>
            </li>
          </ul>
        </div>
        <img src="./assets/images/footer-shape-3.png" width="637" height="173" loading="lazy" alt="Shape" className="shape shape-3 move-anim" />
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="copyright">Copyright 2024,  All Rights Reserved.</p>
          <img src="./assets/images/footer-shape-2.png" width="778" height="335" loading="lazy" alt="Shape" className="shape shape-2" />
          <img src="./assets/images/footer-shape-1.png" width="805" height="652" loading="lazy" alt="Red Car" className="shape shape-1 move-anim" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
