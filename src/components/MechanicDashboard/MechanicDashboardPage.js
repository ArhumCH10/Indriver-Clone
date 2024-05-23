// MechanicDashboardPage.js
import React, { useState } from 'react';
import './MechanicDashboardPage.css';

function MechanicDashboardPage() {
  const [mechanic, setMechanic] = useState({ name: '', expertise: '' });
  const [isActive, setIsActive] = useState(false);
  const [requests, setRequests] = useState([
    { id: 1, details: 'Engine repair for Honda Accord' },
    { id: 2, details: 'Brake replacement for Toyota Camry' },
    { id: 3, details: 'Oil change for Ford F-150' }
  ]);

  const handleMechanicChange = (e) => {
    const { name, value } = e.target;
    setMechanic({ ...mechanic, [name]: value });
  };

  const handleAddMechanic = () => {
    // Add the mechanic to the system (this would involve an API call in a real app)
    alert('Mechanic added successfully!');
  };

  const handleActivate = () => {
    setIsActive(!isActive);
    // Update mechanic status (this would involve an API call in a real app)
    alert(isActive ? 'Mechanic deactivated' : 'Mechanic activated');
  };

  const handleRequestResponse = (requestId, response) => {
    // Handle request response (this would involve an API call in a real app)
    setRequests(requests.filter(request => request.id !== requestId));
    alert(`Request ${response}`);
  };

  return (
    <div className="mechanic-dashboard">
      <h1>Mechanic Dashboard</h1>

      <div className="mechanic-form">
        <h2>Add Mechanic</h2>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={mechanic.name}
          onChange={handleMechanicChange}
        />
        <input
          type="text"
          name="expertise"
          placeholder="Expertise Field"
          value={mechanic.expertise}
          onChange={handleMechanicChange}
        />
        <button onClick={handleAddMechanic} className="add-mechanic-button">Add Mechanic</button>
      </div>

      <div className="activation-section">
        <h2>Mechanic Status</h2>
        <button onClick={handleActivate} className={`status-button ${isActive ? 'active' : 'inactive'}`}>
          {isActive ? 'Deactivate' : 'Activate'}
        </button>
      </div>

      <div className="requests">
        <h2>Service Requests</h2>
        {requests.length === 0 ? (
          <p>No service requests</p>
        ) : (
          requests.map(request => (
            <div key={request.id} className="request">
              <p>{request.details}</p>
              <button onClick={() => handleRequestResponse(request.id, 'accepted')} className="accept-button">Accept</button>
              <button onClick={() => handleRequestResponse(request.id, 'rejected')} className="reject-button">Reject</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MechanicDashboardPage;
