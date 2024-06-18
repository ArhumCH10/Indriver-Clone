import React, { useState, useEffect } from 'react';
import './DriverDashboardPage.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DriverDashboardPage() {
  const [vehicle, setVehicle] = useState({ type: '', model: '', licensePlate: '' });
  const [isActive, setIsActive] = useState(false);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [driverLocation, setDriverLocation] = useState(null); // State to hold driver location

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const userString = localStorage.getItem('user');
        if (!userString) {
          toast.error('User is not authenticated');
          return;
        }

        const user = JSON.parse(userString);
        const userId = user._id;

        const response = await axios.get(`http://localhost:8080/user/status/${userId}`);
        if (response.status === 200) {
          setIsActive(response.data.active);
        }
      } catch (error) {
        toast.error('Error fetching user status: ' + (error.response?.data?.error || error.message));
      }
    };

    fetchUserStatus();
  }, []);

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicle({ ...vehicle, [name]: value });
  };

  const handleAddVehicle = async () => {
    try {
      const { type, model, licensePlate } = vehicle;
      if (!type || !model || !licensePlate) {
        toast.error('Please fill in all fields');
        return;
      }

      const userString = localStorage.getItem('user');
      if (!userString) {
        toast.error('User is not authenticated');
        return;
      }

      const user = JSON.parse(userString);
      const userId = user._id;

      const response = await axios.post('http://localhost:8080/vehicle/add-vehicle', null, {
        params: { type, model, licensePlate, userId }
      });

      if (response.status === 200) {
        toast.success('Vehicle added successfully!');
        setVehicle({ type: '', model: '', licensePlate: '' }); // Reset the form
      }
    } catch (error) {
      toast.error('Error adding vehicle: ' + (error.response?.data?.error || error.message));
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation is not supported by your browser');
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          () => {
            reject('Unable to retrieve your location');
          }
        );
      }
    });
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

      if (!isActive) {
        try {
          const { latitude, longitude } = await getCurrentLocation();
          const response = await axios.post('http://localhost:8080/user/toggle-active', { userId, latitude, longitude });

          if (response.status === 200) {
            setIsActive(true);
            setDriverLocation({ latitude, longitude });
            toast.success(response.data.message);
          }
        } catch (locationError) {
          toast.error(locationError);
        }
      } else {
        const response = await axios.post('http://localhost:8080/user/toggle-active', { userId, latitude: null, longitude: null });

        if (response.status === 200) {
          setIsActive(false);
          setDriverLocation(null);
          toast.success(response.data.message, {
            onClose: () => {
              toast.info('You have become offline');
            }
          });
        }
      }
    } catch (error) {
      toast.error('Error toggling status: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleBookingResponse = (bookingId, response) => {
    // Handle booking response (this would involve an API call in a real app)
    setBookingRequests(bookingRequests.filter((request) => request.id !== bookingId));
    alert(`Booking ${response}`);
  };

  return (
    <div className="driver-dashboard">
      <h1>Driver Dashboard</h1>
      <ToastContainer />

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

      {driverLocation && (
        <div className="location-info">
          <h2>Current Location</h2>
          <p>Latitude: {driverLocation.latitude}</p>
          <p>Longitude: {driverLocation.longitude}</p>
        </div>
      )}

      <div className="booking-requests">
        <h2>Booking Requests</h2>
        {bookingRequests.length === 0 ? (
          <p>No booking requests</p>
        ) : (
          bookingRequests.map((request) => (
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