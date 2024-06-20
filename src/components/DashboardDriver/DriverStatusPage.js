import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './DriverStatusPage.css';
import axios from 'axios'; 


function DriverStatusPage() {
  const [drivers, setDrivers] = useState([]);
  const location = useLocation();
  
  useEffect(() => {
    if (location.state && location.state.drivers) {
      console.log(location.state.drivers);
      setDrivers(location.state.drivers);
    }
  }, [location.state]);

  const handleAcceptRide = async (driverId,price) => {
    try {
      const userId = JSON.parse(localStorage.getItem('user'))._id;

      const dataToSend = {
        userId,
        driverId,
        price,
        status:true,
        pickUp: drivers[0].pickUp,
        destination: drivers[0].destination,
      };
      console.log(dataToSend);

      const response = await axios.post('http://localhost:8080/DriverRequest', dataToSend);
      console.log('Accept ride response:', response.data);
     
    } catch (error) {
      console.error('Error accepting ride:', error);
     
    }
  };

  const handleRejectRide = (driverId) => {
    console.log(`Ride rejected for driver ID: ${driverId}`);
  };

  return (
    <div className="driver-status-page">
      <h1>Available Drivers</h1>
      <p><b> PickUp location</b> {drivers[0].pickUp}</p> <br/>
      <p><b> Destination location</b> {drivers[0].destination}</p> <br/>

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
                <button onClick={() => handleAcceptRide(driver._id,driver.price.toFixed(2))} className="accept-button">Send Ride Request</button>
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