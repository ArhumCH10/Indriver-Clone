import React, { useState, useEffect } from 'react';
import './MechanicDashboardPage.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const ACCESS_TOKEN = 'pk.c3869e335c8c12695c653d2da61c24ff';

const markerIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41],
});

const SetViewOnChange = ({ coords }) => {
  const map = useMap();

  useEffect(() => {
    if (coords && coords.lat && coords.lng) {
      map.flyTo(coords, 16, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [coords, map]);

  return null;
};

function MechanicDashboardPage() {
  const [mechanic, setMechanic] = useState({ name: '', expertise: '', experience: '', contactNumber: '' });
  const [isActive, setIsActive] = useState(false);
  const [requests, setRequests] = useState([]);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [proposedPrice, setProposedPrice] = useState('');
  const [customerLocation, setCustomerLocation] = useState(null);
  const [id, setId] = useState(null);
  const [showReachedButton, setShowReachedButton] = useState(false);
  const [currentRequestForMap, setCurrentRequestForMap] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userString = localStorage.getItem('user');
      if (!userString) {
        toast.error('User is not authenticated');
        return;
      }

      const user = JSON.parse(userString);
      const userId = user._id;
      setId(userId);

      try {
        const response = await axios.get(`http://localhost:8080/user/${userId}`);
        if (response.status === 200) {
          setMechanic(response.data);
          setIsActive(response.data.active);
        }
      } catch (error) {
        toast.error('Error fetching user data: ' + (error.response?.data?.error || error.message));
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      const userString = localStorage.getItem('user');
      if (!userString) {
        toast.error('User is not authenticated');
        return;
      }

      const user = JSON.parse(userString);
      const userId = user._id;

      try {
        const response = await axios.get(`http://localhost:8080/mechanic/requests/${userId}`);
        if (response.status === 200) {
          setRequests(response.data);
        }
      } catch (error) {
        toast.error('Error fetching requests: ' + (error.response?.data?.error || error.message));
      }
    };

    fetchRequests();
  }, []);

  const handleMechanicChange = (e) => {
    const { name, value } = e.target;
    setMechanic({ ...mechanic, [name]: value });
  };

  const handleAddMechanic = async () => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      toast.error('User is not authenticated');
      return;
    }

    const user = JSON.parse(userString);
    const userId = user._id;

    try {
      const { name, expertise, experience, contactNumber } = mechanic;
      if (!name || !expertise || !experience || !contactNumber) {
        toast.error('Please fill in all fields');
        return;
      }
      const response = await axios.post(`http://localhost:8080/user/add-mechanic`, null, {
        params: { userId, name, expertise, experience, contactNumber }
      });
      if (response.status === 200) {
        toast.success('Mechanic added successfully!');
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

      const response = await axios.post('http://localhost:8080/toggle-active', { userId });

      if (response.status === 200) {
        setIsActive(response.data.user.active);
        toast.success(response.data.message);
      }

    } catch (error) {
      toast.error('Error toggling status: ' + (error.response?.data?.error || error.message));
    }
  };

  const openPriceForm = (requestId) => {
    setCurrentRequestId(requestId);
    setProposedPrice('');
  };

  const closePriceForm = () => {
    setCurrentRequestId(null);
    setProposedPrice('');
  };

  const handleProposePrice = async () => {
    if (!proposedPrice) {
      toast.error('Please enter a price');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/mechanic/propose-price`, { requestId: currentRequestId, proposedPrice });

      if (response.status === 200) {
        toast.success('Price proposed successfully!');
        setRequests(requests.map(request => 
          request._id === currentRequestId ? { ...request, proposedPrice, status: 'waiting for customer response' } : request
        ));
        closePriceForm();
      }
    } catch (error) {
      toast.error('Error proposing price: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleReached = async (requestId) => {
    try {
      await axios.put(`http://localhost:8080/mechanic/request/${requestId}/${id}/reached`);
      toast.success('You have reached the customer');
      setRequests(requests.map(request =>
        request._id === requestId ? { ...request, status: 'reached to customer and fixing the issue' } : request
      ));
      setCustomerLocation(null); // Hide the map
      setShowReachedButton(false); // Hide the reached button
    } catch (error) {
      console.error('Error updating reached status:', error);
    }
  };

  const handlePaymentReceived = async (requestId) => {
    try {
      const response = await axios.post(`http://localhost:8080/request/${requestId}/payment-status`);
      if (response.status === 200) {
        toast.success('Payment received successfully');
        setRequests(requests.filter(request => request._id !== requestId));
      }
    } catch (error) {
      toast.error('Error confirming payment: ' + (error.response?.data?.error || error.message));
    }
  };

  const showCustomerLocation = (userId, requestId) => {
    const location = {
      lat: userId.latitude,
      lng: userId.longitude
    };

    if (location.lat && location.lng) {
      setCustomerLocation(location);
      setCurrentRequestForMap(requestId); // Set the current request ID for the map
      setShowReachedButton(true); // Show the reached button
    } else {
      toast.error('Invalid customer location data');
    }
  };

  return (
    <div className="mechanic-dashboard">
      <h1>Mechanic Dashboard</h1>
      <ToastContainer />

      <div className="mechanic-form">
        <h2>Details</h2>
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
        <button onClick={handleAddMechanic} className="add-mechanic-button">Update Details</button>
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
            <div key={request._id} className="request">
              <p><strong>User Name:</strong> {request.userId.name}</p>
              <p><strong>Email:</strong> {request.userId.email}</p>
              <p><strong>Location:</strong> {request.userId.address}</p>
              <p><strong>Problem Description:</strong> {request.problemDescription}</p>
              <p><strong>Phone:</strong> {request.userId.phone}</p>
              <p><strong>Price:</strong> {request.proposedPrice}</p>
              <p><strong>Status:</strong> {request.status}</p>
              {request.status === 'pending' && (
                <>
                  {currentRequestId === request._id ? (
                    <div>
                      <input
                        type="number"
                        placeholder="Proposed Price"
                        value={proposedPrice}
                        onChange={(e) => setProposedPrice(e.target.value)}
                      />
                      <button onClick={handleProposePrice}>Submit</button>
                      <button onClick={closePriceForm}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => openPriceForm(request._id)}>Propose Price</button>
                  )}
                </>
              )}
              {request.status === 'accepted' && (
                <button onClick={() => showCustomerLocation(request.userId, request._id)}>Show Customer Location</button>
              )}
              {request.status === 'waiting for mechanic to reach' && (
                <button onClick={() => handleReached(request._id)}>Confirm Reached</button>
              )}
              {request.status === 'reached to customer and fixing the issue' && (
                <button onClick={() => handlePaymentReceived(request._id)}>Confirm Payment Received</button>
              )}
            </div>
          ))
        )}
      </div>

      {customerLocation && (
        <div className="map-container">
          <MapContainer center={customerLocation} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer
              url={`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${ACCESS_TOKEN}`}
              id="mapbox/streets-v11"
            />
            <Marker position={customerLocation} icon={markerIcon} />
            <SetViewOnChange coords={customerLocation} />
          </MapContainer>
          {showReachedButton && (
            <button onClick={() => handleReached(currentRequestForMap)} className="reached-button">
              Confirm Reached
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default MechanicDashboardPage;