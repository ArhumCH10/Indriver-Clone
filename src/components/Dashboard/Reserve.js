import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Reserve.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Reserve = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [driverResponses, setDriverResponses] = useState([]);
  const [id, setId] = useState();

  useEffect(() => {
    const fetchSentRequests = async () => {
      const userId = location.state?.userId;
      if (!userId) {
        console.error('User ID not found in location state');
        return;
      }

      setId(userId);
      try {
        const response = await axios.post('http://localhost:8080/getSentRequests', { userId });
        setDriverResponses(response.data);
      } catch (error) {
        console.error('Error fetching sent requests:', error);
      }
    };

    if (location.state) {
      fetchSentRequests();
    } else {
      console.error('Location state is null or undefined');
    }
  }, [location.state]);

  useEffect(() => {
    const fetchAcceptedStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/bookingRequest/status/${id}`);
        if (response.data.accepted) {
          const acceptedRequest = response.data.booking;
          navigate('/userdashboard/map', { 
            state: { 
              bookingId: acceptedRequest._id, 
              userId: location.state.userId, 
              driverId: acceptedRequest.driverId 
            } 
          });
        }
      } catch (error) {
        console.error('Error fetching accepted status:', error);
      }
    };

    if (location.state) {
      fetchAcceptedStatus();
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (location.state) {
      const acceptedRequest = driverResponses.find(request => request.status === 'accepted');
      if (acceptedRequest) {
        navigate('/userdashboard/map', { state: { bookingId: acceptedRequest._id, userId: location.state.userId, driverId: acceptedRequest.driverId._id } });
      }
    }
  }, [driverResponses, navigate, location.state]);

  const handleResponse = async (requestId, status, newPrice = null) => {
    try {
      const data = { status, price: newPrice };
      const response = await axios.put(`http://localhost:8080/bookingRequest/${requestId}`, data);

      if (response.status === 200) {
        toast.success(`Request ${status === 'accepted' ? 'accepted' : status === 'rejected' ? 'rejected' : 'price proposed'} successfully`);
        setDriverResponses(driverResponses.filter(request => request._id !== requestId));

        if (status === 'accepted') {
          const acceptedRequest = driverResponses.find(request => request._id === requestId);
          navigate('/userdashboard/map', { state: { bookingId: requestId, userId: location.state.userId, driverId: acceptedRequest.driverId._id } });
        }
      }
    } catch (error) {
      toast.error('Error responding to request: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="reserve-page">
      <ToastContainer />
      <h1>Waiting for Driver Response</h1>
      {driverResponses.map((request) => (
        <div key={request._id} className="request-details">
          <h2>Request to {request.driverId?.name}</h2>
          <p><strong>PickUp location:</strong> {request.pickUp}</p>
          <p><strong>Destination location:</strong> {request.destination}</p>
          <p><strong>Driver Name:</strong> {request.driverId?.name}</p>
          {request.driverId?.vehicleId && (
            <>
              <p><strong>Vehicle Type:</strong> {request.driverId.vehicleId.type}</p>
              <p><strong>Vehicle Model:</strong> {request.driverId.vehicleId.model}</p>
              <p><strong>License Plate:</strong> {request.driverId.vehicleId.licensePlate}</p>
            </>
          )}
          <p><strong>Price:</strong> Rs {request.price}</p>
          <p><strong>Number of days: </strong> {request.days}</p>
          {request.newPriceProposed && (
            <>
              <p><strong>New Proposed Price:</strong> Rs {request.newPriceProposed}</p>
              <div className="button-group">
                <button onClick={() => handleResponse(request._id, 'accepted')} className="accept-button">Accept</button>
                <button onClick={() => handleResponse(request._id, 'rejected')} className="reject-button">Reject</button>
                <button onClick={() => {
                  const newPrice = prompt('Enter your proposed price:');
                  handleResponse(request._id, 'price_proposed', newPrice);
                }} className="propose-button">Propose New Price</button>
              </div>
            </>
          )}
        </div>
      ))}
      <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default Reserve;