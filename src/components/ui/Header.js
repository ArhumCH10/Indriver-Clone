import React from 'react';
import '../styles/style.css';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function Header() {
  const navbarListStyle = {
    listStyle: 'none', // Remove default list styles
    padding: 0,
    margin: 0,
    textAlign: 'center', // Center-align the list items
  };

  const navbarItemStyle = {
    display: 'inline-block', // Display list items inline
    margin: '0 10px', // Add spacing between items
  };

  const linkStyle = {
    textDecoration: 'none', // Remove underline from links
    color: 'white', // Set link color
    fontSize:"20px"
  };
  return (
    <header className="header">
      <div className="container">
        <a href="#" className="logo">
          <img src="./assets/images/Logo.png" width="158" height="100" alt="autofix home" />
        </a>
        <nav className="navbar">
        <ul className="navbar-list" style={navbarListStyle}>
        <li style={navbarItemStyle}>
              <Link to="/" style={linkStyle}>Home</Link>
            </li>
            <li style={navbarItemStyle}>
              <Link to="/login" style={linkStyle}>Login</Link>
            </li>
            <li style={navbarItemStyle}>
              <Link to="/signup" style={linkStyle}>Signup</Link>
            </li>
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
