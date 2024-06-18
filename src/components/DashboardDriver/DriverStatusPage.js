import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './DriverStatusPage.css';

function DriverStatusPage() {
  const [drivers, setDrivers] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.drivers) {
      setDrivers(location.state.drivers);
    }
  }, [location.state]);

  const handleAcceptRide = (driverId) => {
    console.log(`Ride accepted for driver ID: ${driverId}`);
  };

  const handleRejectRide = (driverId) => {
    console.log(`Ride rejected for driver ID: ${driverId}`);
  };

  return (
    <div className="driver-status-page">
      <h1>Available Drivers</h1>
      <div className="drivers-list">
        {drivers.length === 0 ? (
          <p>No drivers available at the moment.</p>
        ) : (
          drivers.map((driver) => (
            <div key={driver._id} className="driver-card">
              <h2>{driver.name}</h2>
              <p><strong>Email:</strong> {driver.email}</p>
              <p><strong>Latitude:</strong> {driver.latitude}</p>
              <p><strong>Longitude:</strong> {driver.longitude}</p>
              {driver.vehicleId && (
                <div className="vehicle-info">
                  <p><strong>Vehicle Type:</strong> {driver.vehicleId.type}</p>
                  <p><strong>Vehicle Model:</strong> {driver.vehicleId.model}</p>
                  <p><strong>License Plate:</strong> {driver.vehicleId.licensePlate}</p>
                  <p><strong>Price:</strong> Rs{driver.price ? driver.price.toFixed(2) : 'N/A'}</p>
                </div>
              )}
              <div className="button-group">
                <button onClick={() => handleAcceptRide(driver._id)} className="accept-button">Accept Ride</button>
                <button onClick={() => handleRejectRide(driver._id)} className="reject-button">Reject Ride</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DriverStatusPage;