import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DriverDashboardPage.css';
import ReactModal from 'react-modal';

const ACCESS_TOKEN = 'pk.c3869e335c8c12695c653d2da61c24ff';

function DriverDashboardPage() {
  const [vehicle, setVehicle] = useState({ type: '', model: '', licensePlate: '', vehicleName: '' });
  const [isActive, setIsActive] = useState(false);
  const [vehicleRegistered, setVehicleRegistered] = useState(false);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [driverLocation, setDriverLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [acceptedBooking, setAcceptedBooking] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paid, setPaid] = useState(false);
  const [shownAcceptedModal, setShownAcceptedModal] = useState(false);
  const [shownPaymentModal, setShownPaymentModal] = useState(false);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const userString = localStorage.getItem('user');
        if (!userString) {
          toast.error('User is not authenticated');
          return;
        }

        const user = JSON.parse(userString);
        const userId = user._id;

        // Fetch user status
        const statusResponse = await axios.get(`http://localhost:8080/user/status/${userId}`);
        if (statusResponse.status === 200) {
          setIsActive(statusResponse.data.active);
        }

        // Fetch vehicle details
        const vehicleResponse = await axios.get(`http://localhost:8080/vehicle/${userId}`);
        if (vehicleResponse.status === 200 && vehicleResponse.data) {
          setVehicle(vehicleResponse.data);
          setVehicleRegistered(true);
        }

        // Fetch booking requests
        const bookingResponse = await axios.get(`http://localhost:8080/bookingRequests/${userId}`);
        if (bookingResponse.status === 200) {
          // Filter booking requests where status is true
          setBookingRequests(bookingResponse.data.filter(request => request.status === true));
        }
      } catch (error) {
        toast.error('Error fetching data: ' + (error.response?.data?.error || error.message));
      }
    };

    fetchDriverData();
  }, []);

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicle({ ...vehicle, [name]: value });
  };

  const handleSaveVehicle = async () => {
    try {
      const { type, model, licensePlate, vehicleName } = vehicle;  // Include vehicleName
      if (!type || !model || !licensePlate || !vehicleName) {  // Check vehicleName
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
        params: { type, model, licensePlate, vehicleName, userId }  // Include vehicleName
      });

      if (response.status === 200) {
        toast.success('Vehicle saved successfully!');
        setVehicleRegistered(true);
      }
    } catch (error) {
      toast.error('Error saving vehicle: ' + (error.response?.data?.error || error.message));
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
            axios.get(`https://us1.locationiq.com/v1/reverse.php?key=${ACCESS_TOKEN}&lat=${latitude}&lon=${longitude}&format=json`)
              .then(response => {
                resolve(response.data.display_name);  // Resolve with address
              })
              .catch(error => {
                reject('Unable to retrieve address');
              });
          },
          () => {
            reject('Unable to retrieve your location');
          }
        );
      }
    });
  };

  const handleShowMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setDriverLocation({ latitude, longitude });
        axios.get(`https://us1.locationiq.com/v1/reverse.php?key=${ACCESS_TOKEN}&lat=${latitude}&lon=${longitude}&format=json`)
          .then(response => {
            setAddress(response.data.display_name);
          })
          .catch(error => {
            console.error('Error fetching address data:', error);
          });
      }, error => {
        console.error('Error getting geolocation:', error);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    handleShowMyLocation();
  }, []);

  const handleActivate = async () => {
    if (!vehicleRegistered) {
      toast.error('Please register your vehicle first');
      return;
    }

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
          const address = await getCurrentLocation();  // Get address
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
              const { latitude, longitude } = position.coords;
              const response = await axios.post('http://localhost:8080/toggle-active', { userId, address, latitude, longitude });

              if (response.status === 200) {
                setIsActive(true);
                setAddress(address);  // Set address
                toast.success(response.data.message);
              }
            }, error => {
              toast.error('Unable to retrieve your location');
            });
          } else {
            toast.error('Geolocation is not supported by your browser');
          }
        } catch (locationError) {
          toast.error(locationError);
        }
      } else {
        const response = await axios.post('http://localhost:8080/toggle-active', { userId, address: null, latitude: null, longitude: null });

        if (response.status === 200) {
          setIsActive(false);
          setAddress(null);  // Clear address
          toast.success(response.data.message);
        }
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request data:', error.request);
      } else {
        console.error('General Error message:', error.message);
      }
      toast.error('Error toggling status: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleBookingResponse = async (bookingId, response, newPrice = null) => {
    try {
      const data = { status: response, price: newPrice };
      const res = await axios.put(`http://localhost:8080/bookingRequest/${bookingId}`, data);

      if (res.status === 200) {
        if (response === 'accepted') {
          const booking = bookingRequests.find(request => request._id === bookingId);
          setAcceptedBooking(booking);
          setAccepted(true); // Trigger accepted state
        }
        setBookingRequests(bookingRequests.filter(request => request._id !== bookingId));
        toast.success(`Booking ${response === 'accepted' ? 'accepted' : 'rejected'} successfully`);
      }
    } catch (error) {
      toast.error('Error responding to booking request: ' + (error.response?.data?.error || error.message));
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const userString = localStorage.getItem('user');
        if (!userString) {
          toast.error('User is not authenticated');
          return;
        }

        const user = JSON.parse(userString);
        const userId = user._id;

        const statusResponse = await axios.get(`http://localhost:8080/bookingRequest/status/${userId}`);
        if (statusResponse.status === 200 && statusResponse.data.accepted) {
          setAcceptedBooking(statusResponse.data.booking);
          setAccepted(true);
          setPaid(statusResponse.data.booking.cashPaid);
        }
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          if (error.response.data && error.response.data.error) {
            toast.error('Error fetching accepted status: ' + error.response.data.error);
          } else if (error.message) {
            toast.error('Error fetching accepted status: ' + error.message);
          }
        }
      }
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (accepted && !paid && !shownAcceptedModal) {
      setModalIsOpen(true);
      setShownAcceptedModal(true); // Mark accepted modal as shown
    } else if (accepted && paid && !shownPaymentModal) {
      setModalIsOpen(false);
      setPaymentModal(true);
      setShownPaymentModal(true); // Mark payment modal as shown
    }
  }, [accepted, paid, shownAcceptedModal, shownPaymentModal]);

  const closeModal = () => {
    setModalIsOpen(false);
    setAcceptedBooking(null);
    setAccepted(false);
  };

  const closePaymentModal = () => {
    setPaymentModal(false);
    setModalIsOpen(false);
    setAcceptedBooking(null);
    setAccepted(false);
    setPaid(false);
  };

  return (
    <>
      <div className="driver-dashboard">
        <h1>Car Owner Dashboard</h1>
        <ToastContainer />

        <div className="section vehicle-form-section">
          {vehicleRegistered ? (
            <div className="vehicle-details">
              <h2>Vehicle Details</h2>
              <p><strong>Type:</strong> {vehicle.type}</p>
              <p><strong>Model:</strong> {vehicle.model}</p>
              <p><strong>Vehicle Name:</strong> {vehicle.vehicleName}</p>
              <p><strong>License Plate:</strong> {vehicle.licensePlate}</p>
              <button onClick={() => setVehicleRegistered(false)} className="edit-vehicle-button">Edit Vehicle</button>
            </div>
          ) : (
            <>
              <h2>Add/Edit Vehicle</h2>
              <div className="vehicle-inputs">
                <input
                  type="text"
                  name="type"
                  placeholder="Vehicle Type"
                  value={vehicle.type}
                  onChange={handleVehicleChange}
                />
                <input
                  type="text"
                  name="vehicleName"
                  placeholder="Vehicle Name"
                  value={vehicle.vehicleName}
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
              </div>
              <button onClick={handleSaveVehicle} className="save-vehicle-button">Save Vehicle</button>
            </>
          )}
        </div>

        <div className="section activation-section">
          <h2>Driver Status</h2>
          <button onClick={handleActivate} className={`status-button ${isActive ? 'active' : 'inactive'}`}>
            {isActive ? 'Deactivate' : 'Activate'}
          </button>
          {driverLocation && (
            <div className="location-info">
              <h3>Current Location</h3>
              <p>Latitude: {driverLocation?.latitude}</p>
              <p>Longitude: {driverLocation?.longitude}</p>
              <p>Address: {address && address}</p>
            </div>
          )}
        </div>

        <div className="section booking-requests-section">
          <h2>Booking Requests</h2>
          {bookingRequests.length === 0 ? (
            <p>No booking requests</p>
          ) : (
            bookingRequests.map((request) => (
              <div key={request._id} className="booking-request">
                <div className="request-details">
                  <p><strong>PickUp:</strong> {request.pickUp}</p>
                  <p><strong>Destination:</strong> {request.destination}</p>
                  <p><strong>Price:</strong> Rs{request.price}</p>
                  <p><strong>Number of days:</strong> {request.days}</p>
                  <p><strong>User Details:</strong> {request.user.name} ({request.user.email}, {request.user.contactNumber})</p>
                  {request.newPriceProposed !== null && (
                    <p><strong>New Proposed Price:</strong> Rs {request.newPriceProposed}</p>
                  )}
                  <div className="button-group">
                    <button onClick={() => handleBookingResponse(request._id, 'accepted')} className="accept-button">Accept</button>
                    <button onClick={() => handleBookingResponse(request._id, 'rejected')} className="reject-button">Reject</button>
                    <button onClick={() => {
                      const newPrice = prompt('Enter new price:');
                      handleBookingResponse(request._id, 'price_proposed', newPrice);
                    }} className="propose-button">Propose New Price</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Booking Accepted"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Congratulations!</h2>
        {acceptedBooking && (
          <div>
            <p>Booking accepted successfully!</p>
            <p>
              User will pick up this car from your location and deliver it after {acceptedBooking.days} days.
            </p>
            <p>You will get Rs {acceptedBooking.price}/- as cash</p>
          </div>
        )}
        <button onClick={closeModal}>Okay</button>
      </ReactModal>

      <ReactModal
        isOpen={paymentModal}
        onRequestClose={closePaymentModal}
        contentLabel="Payment Received"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Payment Received</h2>
        <div>
          <p>Payment received successfully!</p>
        </div>
        <button onClick={closePaymentModal}>Okay</button>
      </ReactModal>
    </>
  );
}

export default DriverDashboardPage;
