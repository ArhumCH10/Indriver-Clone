import React from 'react';
import { FaWrench, FaSearch, FaRegCalendarAlt, FaHome, FaMapMarkerAlt } from 'react-icons/fa';
import './Services.css';
import { useNavigate } from 'react-router-dom';
import { MdElectricRickshaw } from 'react-icons/md';

const Services = () => {
  const navigate = useNavigate();

  const handleDestinationClick = () => {
    navigate('/userdashboard/destination');
  };

  const handleReserveClick = () => {
    navigate('/userdashboard/reserve');
  };

  const handleMechanicClick = () => {
    navigate('/userdashboard/findMechanic');
  };

  return (
    <div className="services-container">
      <div className="services-section">
        <div className="service-card" onClick={handleReserveClick}>
          <FaRegCalendarAlt size={50} />
          <p>Reserve</p>
        </div>
        <div className="service-card" onClick={handleMechanicClick}>
          <FaWrench size={50} />
          <p>Mechanic</p>
        </div>
      </div>
      <div className="search-container">
        <input type="text" placeholder="Enter pick-up point" onClick={handleDestinationClick} />
        <FaSearch size={20} className="search-icon" onClick={handleDestinationClick} />
      </div>
      <div className="footer">
        <div className="footer-item highlighted">
          <FaHome size={30} />
          <p>Home</p>
        </div>
        <div className="footer-item" onClick={handleDestinationClick}>
          <FaMapMarkerAlt size={30} />
          <p>Destination</p>
        </div>
      </div>
    </div>
  );
};

export default Services;
