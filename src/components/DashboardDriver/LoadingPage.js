import React from 'react';
import './LoadingPage.css';

const LoadingPage = () => {
  return (
    <div className="loading-page">
      <div className="spinner"></div>
      <h2>Waiting for driver response...</h2>
    </div>
  );
};

export default LoadingPage;