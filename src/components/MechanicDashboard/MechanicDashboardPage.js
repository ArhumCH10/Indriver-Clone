import React, { useState, useEffect } from 'react';
import './MechanicDashboardPage.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MechanicDashboardPage() {
    const [mechanic, setMechanic] = useState({ name: '', expertise: '', experience: '', contactNumber: '' });
    const [isActive, setIsActive] = useState(false);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const userString = localStorage.getItem('user');
            if (!userString) {
                toast.error('User is not authenticated');
                return;
            }

            const user = JSON.parse(userString);
            const userId = user._id;

            try {
                const response = await axios.get(`http://localhost:8080/user/${userId}`);
                if (response.status === 200) {
                    setMechanic(response.data);
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

    // Function to convert coordinates to specific address (enhanced reverse geocoding)
    const fetchAddressFromCoordinates = async (latitude, longitude) => {
        try {
            const response = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            if (response.status === 200) {
                const { principalSubdivision, city, locality } = response.data;
                return `${locality || city || principalSubdivision || 'Unknown location'}`;
            } else {
                throw new Error('Unable to fetch address');
            }
        } catch (error) {
            console.error('Error fetching address:', error);
            return 'Unknown location';
        }
    };

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
        console.log('Mechanic details:', mechanic);
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

            const { name, expertise, experience, contactNumber } = mechanic;
            if (!name || !expertise || !experience || !contactNumber) {
                toast.error('Please fill in all fields');
                return;
            }

            const user = JSON.parse(userString);
            const userId = user._id;

            const response = await axios.post('http://localhost:8080/toggle-active', { userId });

            if (response.status === 200) {
                setIsActive(!isActive);
                toast.success(response.data.message);
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

    const handleRequestResponse = async (requestId, response) => {
        // Handle request response (this would involve an API call in a real app)
        setRequests(requests.filter(request => request._id !== requestId));
        alert(`Request ${response}`);
    };

    // Function to fetch and update specific address for each request
    const fetchRequestsAddress = async () => {
        const updatedRequests = await Promise.all(
            requests.map(async request => {
                const { userId: { latitude, longitude } } = request;
                const address = await fetchAddressFromCoordinates(latitude, longitude);
                return { ...request, address };
            })
        );
        setRequests(updatedRequests);
    };

    useEffect(() => {
        fetchRequestsAddress();
    }, [requests]);

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
                            <p><strong>Location:</strong> {request.address}</p>
                            <p><strong>Problem Description:</strong> {request.problemDescription}</p>
                            <p><strong>Request Date:</strong> {new Date(request.requestDateTime).toLocaleString()}</p>
                            <button onClick={() => handleRequestResponse(request._id, 'accepted')} className="accept-button">Accept</button>
                            <button onClick={() => handleRequestResponse(request._id, 'rejected')} className="reject-button">Reject</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default MechanicDashboardPage;
