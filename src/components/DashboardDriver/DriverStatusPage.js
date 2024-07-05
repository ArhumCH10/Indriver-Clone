import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './DriverStatusPage.css';
import axios from 'axios'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingPage from './LoadingPage';

function DriverStatusPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unpaidRequests, setUnpaidRequests] = useState({});
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [days, setDays] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem('user'))._id;

  useEffect(() => {
    if (location.state && location.state.drivers) {
      setDrivers(location.state.drivers);
      checkUnpaidRequests(location.state.drivers);
    }
  }, [location.state]);

  const checkUnpaidRequests = async (drivers) => {
    try {
      const promises = drivers.map(driver =>
        axios.post('http://localhost:8080/checkRequest', { userId, driverId: driver._id })
      );
      const results = await Promise.all(promises);
      const unpaidRequestsMap = results.reduce((acc, result, index) => {
        acc[drivers[index]._id] = result.data.hasUnpaidRequest;
        return acc;
      }, {});

      setUnpaidRequests(unpaidRequestsMap);
    } catch (error) {
      console.error('Error checking unpaid requests:', error);
    }
  };

  const handleDaysChange = (e) => {
    setDays(e.target.value);
  };

  const handleRequest = (driver) => {
    if (!days) {
      toast.error('Please enter the number of days.');
      return;
    }
    const price = driver.price * days;
    handleAcceptRide(driver._id, price, days);
  };

  const handleAcceptRide = async (driverId, price, days) => {
    if (unpaidRequests[driverId]) {
      toast.info('You have an unpaid request with this driver. Please settle the previous booking first.');
      return;
    }

    try {
      setLoading(true);
      const dataToSend = {
        userId,
        driverId,
        status: true,
        pickUp: drivers[0]?.pickUp,
        destination: drivers[0]?.destination,
        days,
      };

      await axios.post('http://localhost:8080/DriverRequest', dataToSend);
      toast.success('Request Sent Successfully!!');
      navigate('/userdashboard/reserve', { state: { userId } });
    } catch (error) {
      console.error('Error accepting ride:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRide = (driverId) => {
    console.log(`Ride rejected for driver ID: ${driverId}`);
  };

  const handleGoToReserve = () => {
    navigate('/userdashboard/reserve', { state: { userId } });
  };

  const handleDisabledClick = () => {
    toast.info('You have an unpaid request with this driver.');
  };

  return (
    <div className="driver-status-page">
      <ToastContainer />
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <h1>Available Car Owners</h1>
          {drivers.length > 0 && (
            <>
              <p><b>PickUp location:</b> {drivers[0].pickUp}</p> <br/>
              <p><b>Destination location:</b> {drivers[0].destination}</p> <br/>
            </>
          )}

          <div className="drivers-list">
            {drivers.length === 0 ? (
              <p>No Car Owners available at the moment.</p>
            ) : (
              drivers.map((driver) => (
                <div key={driver._id} className="driver-card">
                  <h2>{driver.name}</h2>
                  <p><strong>Email:</strong> {driver.email}</p>
                  <p><strong>Car Owner Address:</strong> {driver.address}</p>
                  {driver.vehicleId && (
                    <div className="vehicle-info">
                      <p><strong>Vehicle Type:</strong> {driver.vehicleId.type}</p>
                      <p><strong>Vehicle Model:</strong> {driver.vehicleId.model}</p>
                      <p><strong>License Plate:</strong> {driver.vehicleId.licensePlate}</p>
                    </div>
                  )}
                  <div className="button-group">
                    <button 
                      onClick={unpaidRequests[driver._id] ? handleDisabledClick : () => setSelectedDriver(driver)} 
                      className={`accept-button ${unpaidRequests[driver._id] ? 'disabled' : ''}`}
                      disabled={unpaidRequests[driver._id]}
                    >
                      {unpaidRequests[driver._id] ? 'Request Sent' : 'Send Ride Request'}
                    </button>
                    <button onClick={() => handleRejectRide(driver._id)} className="reject-button">Reject Ride</button>
                  </div>
                  {selectedDriver && selectedDriver._id === driver._id && (
                    <div className="request-form">
                      <h3>Enter Number of Days</h3>
                      <input type="number" value={days} onChange={handleDaysChange} placeholder="Number of days" />
                      <button onClick={() => handleRequest(driver)}>Send Request</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          <button onClick={handleGoToReserve} className="reserve-button">Go to Reserve Page</button>
        </>
      )}
    </div>
  );
}

export default DriverStatusPage;