import React from 'react';
import '../styles/style.css';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <a href="#" className="logo">
          <img src="./assets/images/logo.png" width="128" height="63" alt="autofix home" />
        </a>
        <nav className="navbar">
          <ul className="navbar-list">
            {["Home", "About", "Services", "Projects", "Contact"].map((item) => (
              <li key={item}>
                <a href="#" className="navbar-link">{item}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#" className="btn btn-primary">
          <span className="span">Get a Quote</span>
          <span className="material-symbols-rounded">arrow_forward</span>
        </a>
        <button className="nav-toggle-btn" aria-label="toggle menu">
          <span className="nav-toggle-icon icon-1"></span>
          <span className="nav-toggle-icon icon-2"></span>
          <span className="nav-toggle-icon icon-3"></span>
        </button>
      </div>
    </header>
  );
}

export default Header;
