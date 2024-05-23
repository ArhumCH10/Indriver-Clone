// DriverDashboardPage.js
import React, { useState } from 'react';
import './DriverDashboardPage.css';

function DriverDashboardPage() {
  const [vehicle, setVehicle] = useState({ type: '', model: '', licensePlate: '' });
  const [isActive, setIsActive] = useState(false);
  const [bookingRequests, setBookingRequests] = useState([]);

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicle({ ...vehicle, [name]: value });
  };

  const handleAddVehicle = () => {
    // Add the vehicle to the system (this would involve an API call in a real app)
    alert('Vehicle added successfully!');
  };

  const handleActivate = () => {
    setIsActive(!isActive);
    // Get current location and update driver status (this would involve an API call in a real app)
    alert(isActive ? 'Driver deactivated' : 'Driver activated and location updated');
  };

  const handleBookingResponse = (bookingId, response) => {
    // Handle booking response (this would involve an API call in a real app)
    setBookingRequests(bookingRequests.filter(request => request.id !== bookingId));
    alert(`Booking ${response}`);
  };

  return (
    <div className="driver-dashboard">
      <h1>Driver Dashboard</h1>

      <div className="vehicle-form">
        <h2>Add Vehicle</h2>
        <input
          type="text"
          name="type"
          placeholder="Vehicle Type"
          value={vehicle.type}
          onChange={handleVehicleChange}
        />
        <input
          type="text"
          name="model"
          placeholder="Vehicle Model"
          value={vehicle.model}
          onChange={handleVehicleChange}
        />
        <input
          type="text"
          name="licensePlate"
          placeholder="License Plate"
          value={vehicle.licensePlate}
          onChange={handleVehicleChange}
        />
        <button onClick={handleAddVehicle} className="add-vehicle-button">Add Vehicle</button>
      </div>

      <div className="activation-section">
        <h2>Driver Status</h2>
        <button onClick={handleActivate} className={`status-button ${isActive ? 'active' : 'inactive'}`}>
          {isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>

      <div className="booking-requests">
        <h2>Booking Requests</h2>
        {bookingRequests.length === 0 ? (
          <p>No booking requests</p>
        ) : (
          bookingRequests.map(request => (
            <div key={request.id} className="booking-request">
              <p>{request.details}</p>
              <button onClick={() => handleBookingResponse(request.id, 'accepted')} className="accept-button">Accept</button>
              <button onClick={() => handleBookingResponse(request.id, 'rejected')} className="reject-button">Reject</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DriverDashboardPage;
