import React, { useState } from 'react';
import './MechanicDashboardPage.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MechanicDashboardPage() {
  const [mechanic, setMechanic] = useState({ name: '', expertise: '', experience: '', contactNumber: '' });
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

  const handleAddMechanic =async () => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      toast.error('User is not authenticated');
      return;
    }
    
    const user = JSON.parse(userString);
    const userId = user._id;
    console.log('Mechanic details:', mechanic);
    try {
      const { name, expertise, experience,contactNumber } = mechanic;
      if (!name || !expertise || !experience || !contactNumber) {
        toast.error('Please fill in all fields');
        return;
      }
      const response = await axios.post(`http://localhost:8080/user/add-mechanic`, null, {
        params: { userId,name, expertise, experience,contactNumber }
      });
      if (response.status === 200) {
        toast.success('Mechanic added successfully!');
        setMechanic({ name: '', expertise: '', experience: '',contactNumber:'' }); // Reset the form
      }
    } catch (error) {
      toast.error('Error adding mechanic: ' + (error.response?.data?.error || error.message));
    }
  };
  

  const handleActivate = async () => {
    try {
      const userString = localStorage.getItem('user');
if (!userString) {
  toast.error('User is not authenticated');
  return;
}

const user = JSON.parse(userString);
const userId = user._id;

      const response = await axios.post('http://localhost:8080/user/toggle-active', { userId });

      if (response.status === 200) {
        setIsActive(prevState => !prevState);
        toast(response.data.message);
      }
    } catch (error) {
      toast.error('Error toggling status: ' + (error.response?.data?.error || error.message));
    }
  };
  const handleRequestResponse = (requestId, response) => {
    // Handle request response (this would involve an API call in a real app)
    setRequests(requests.filter(request => request.id !== requestId));
    alert(`Request ${response}`);
  };

  return (
    <div className="mechanic-dashboard">
      <h1>Mechanic Dashboard</h1>
      <ToastContainer />

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
        <input
          type="text"
          name="experience"
          placeholder="Experience (Years)"
          value={mechanic.experience}
          onChange={handleMechanicChange}
        />
        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number"
          value={mechanic.contactNumber}
          onChange={handleMechanicChange}
        />
        <button onClick={handleAddMechanic} className="add-mechanic-button">Add Mechanic</button>
      </div>

      <div className="activation-section">
        <h2>Mechanic Status</h2>
        <button onClick={handleActivate} className={`status-button ${isActive ? 'active' : 'inactive'}`}>
          {isActive ? 'Deactive' : 'Activate'}
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
