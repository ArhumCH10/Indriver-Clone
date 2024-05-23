import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import './DestinationPage.css';
import { useNavigate } from 'react-router-dom';


const DestinationPage = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
      navigate(-1); // This will navigate back to the previous page
    };
  return (
    <div className="destination-container">
      <div className="destination-header">
        <FaArrowLeft size={20} className="back-icon" onClick={handleBackClick}/>
        <div className="destination-inputs">
          <input type="text" placeholder="Enter pick-up location" />
          <input type="text" placeholder="Where to?" />
        </div>
      </div>
    </div>
  );
};

export default DestinationPage;
