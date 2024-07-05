import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const WaitingPage = () => {
    const location = useLocation();
    const { selectedMechanic, problemDescription } = location.state || {};
    const navigate = useNavigate();
    const [proposedPrice, setProposedPrice] = useState(null);
    const [status, setStatus] = useState('waiting');
    const [requestId, setRequestId] = useState(null);
    const [isIssueFixed, setIsIssueFixed] = useState(false);
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const userString = localStorage.getItem('user');
            if (!userString) {
                console.error('User is not authenticated');
                return;
            }

            const user = JSON.parse(userString);
            const userId = user._id;

            if (selectedMechanic && userId) {
                try {
                    const response = await axios.get(`http://localhost:8080/mechanic/request/${selectedMechanic._id}/${userId}`);
                    if (response.data.requestId) {
                        setRequestId(response.data.requestId);
                    } else {
                        console.error('No matching request found for the given userId');
                    }
                } catch (error) {
                    console.error('Error fetching request ID:', error);
                }
            }
        };

        fetchUserData();
    }, [selectedMechanic]);

    useEffect(() => {
        const fetchProposedPrice = async () => {
            if (!requestId) return;

            try {
                const response = await axios.get(`http://localhost:8080/mechanic/request/${requestId}`);
                if (response.data.status === 'waiting for customer response') {
                    setProposedPrice(response.data.proposedPrice);
                    setStatus('waiting for customer response');
                } else if (response.data.status === 'reached to customer and fixing the issue') {
                    setStatus('reached to customer and fixing the issue');
                }
            } catch (error) {
                console.error('Error fetching proposed price:', error);
            }
        };

        fetchProposedPrice();

        const interval = setInterval(fetchProposedPrice, 5000); // Fetch every 5 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, [requestId]);

    const handleAccept = async () => {
        try {
            await axios.put(`http://localhost:8080/mechanic/request/${requestId}/accept`);
            setStatus('accepted');
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const handleReject = async () => {
        try {
            await axios.put(`http://localhost:8080/mechanic/request/${requestId}/reject`);
            setStatus('rejected');
        } catch (error) {
            console.error('Error rejecting request:', error);
        }
    };

    const handleConfirmFix = async () => {
        setIsIssueFixed(true);
    };

    const handleConfirmPayment = async () => {
        try {
            await axios.put(`http://localhost:8080/mechanic/request/${requestId}/confirm-payment`);
            setPaymentConfirmed(true);
            console.log('Payment confirmed, displaying toast...');
            toast.success('Cash Paid status updated successfully');
            navigate('/userdashboard/dashboard', { replace: true });
        } catch (error) {
            console.error('Error confirming payment:', error);
        }
    };

    if (!selectedMechanic) {
        return <p>No mechanic selected. Please go back and select a mechanic.</p>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
            <ToastContainer />
            <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Waiting for Mechanic Response</h1>
            <div style={{ border: '1px solid #ccc', borderRadius: '1em', marginBottom: '10px', padding: '15px' }}>
                <h2 style={{ fontSize: '1.5em', marginBottom: '5px' }}>{selectedMechanic?.name}</h2>
                <p><strong>Email:</strong> {selectedMechanic?.email}</p>
                <p><strong>Contact Number:</strong> {selectedMechanic?.contactNumber}</p>
                <p><strong>Experience:</strong> {selectedMechanic?.experience}</p>
                <p><strong>Expertise:</strong> {selectedMechanic?.expertise}</p>
                <p><strong>Problem Description:</strong> {problemDescription}</p>
                {status === 'waiting' && <p style={{ textAlign: 'center', marginTop: '20px' }}>Waiting for the mechanic to respond...</p>}
                {status === 'waiting for customer response' && (
                    <>
                        <p><strong>Proposed Price:</strong> {proposedPrice}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                            <button
                                onClick={handleAccept}
                                style={{
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    backgroundColor: '#28a745',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Accept
                            </button>
                            <button
                                onClick={handleReject}
                                style={{
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    backgroundColor: '#dc3545',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Reject
                            </button>
                        </div>
                    </>
                )}
                {status === 'reached to customer and fixing the issue' && (
                    <>
                        <p><strong>Status:</strong> Mechanic has reached and is fixing the issue.</p>
                        {!isIssueFixed && (
                            <button
                                onClick={handleConfirmFix}
                                style={{
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    backgroundColor: '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'block',
                                    margin: '20px auto 0'
                                }}
                            >
                                Confirm Issue Fixed
                            </button>
                        )}
                    </>
                )}
                {isIssueFixed && (
                    <>
                        <p><strong>Proposed Price:</strong> {proposedPrice}</p>
                        <button
                            onClick={handleConfirmPayment}
                            style={{
                                padding: '8px 16px',
                                fontSize: '14px',
                                backgroundColor: '#28a745',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'block',
                                margin: '20px auto 0'
                            }}
                        >
                            Confirm Payment
                        </button>
                    </>
                )}
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'block',
                        margin: '20px auto 0'
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default WaitingPage;