import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeaderUser from '../ui/HeaderUser';
import { FaSpinner } from 'react-icons/fa';
import { Modal, Box, Button, Typography, TextField } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css'; // If you still need Bootstrap for other styling

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ActiveMechanicsPage = () => {
    const [mechanics, setMechanics] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMechanic, setSelectedMechanic] = useState(null);
    const [loading, setLoading] = useState(false);
    const [requestSubmitted, setRequestSubmitted] = useState(false);
    const [problemDescription, setProblemDescription] = useState('');

    useEffect(() => {
        const fetchActiveMechanics = async () => {
            try {
                const response = await axios.get('http://localhost:8080/active-mechanics');
                const mechanicsData = response.data;

                const userString = localStorage.getItem('user');
                if (!userString) {
                    throw new Error('User is not authenticated');
                }
                const user = JSON.parse(userString);
                const userId = user._id;

                const updatedMechanics = mechanicsData.map(mechanic => ({
                    ...mechanic,
                    requestedByUser: mechanic.requestedBy.some(id => id === userId)
                }));

                setMechanics(updatedMechanics);
            } catch (error) {
                console.error('Error fetching active mechanics:', error);
            }
        };

        fetchActiveMechanics();
    }, []);

    const handleAcceptMechanic = (mechanic) => {
        setSelectedMechanic(mechanic);
        setProblemDescription('');
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSubmitRequest = async () => {
        try {
            setLoading(true);

            const userString = localStorage.getItem('user');
            if (!userString) {
                alert('User is not authenticated');
                return;
            }

            const user = JSON.parse(userString);
            const userId = user._id;
            const requestData = {
                userId,
                mechanicId: selectedMechanic._id,
                problemDescription,
                requestDateTime: new Date().toISOString()
            };

            console.log("submit request activated", requestData);

            await axios.post('http://localhost:8080/submit-request', requestData);
            console.log(requestData);
            setRequestSubmitted(true);

            handleCloseModal();
        } catch (error) {
            console.error('Error submitting request:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRejectMechanic = async (mechanicId) => {
        try {
            await axios.delete(`http://localhost:8080/active-mechanics/${mechanicId}`);
            const updatedMechanics = mechanics.filter(mechanic => mechanic._id !== mechanicId);
            setMechanics(updatedMechanics);
        } catch (error) {
            console.error('Error rejecting mechanic:', error);
        }
    };

    return (
        <div>
            <HeaderUser />

            {requestSubmitted ? (
                <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Waiting for Mechanic Response</h1>
                    <div style={{ border: '1px solid #ccc', borderRadius: '1em', marginBottom: '10px', padding: '15px' }}>
                        {selectedMechanic && (
                            <>
                                <h2 style={{ fontSize: '1.5em', marginBottom: '5px' }}>{selectedMechanic?.name}</h2>
                                <p><strong>Email:</strong> {selectedMechanic?.email}</p>
                                <p><strong>Contact Number:</strong> {selectedMechanic?.contactNumber}</p>
                                <p><strong>Experience:</strong> {selectedMechanic?.experience}</p>
                                <p><strong>Expertise:</strong> {selectedMechanic?.expertise}</p>
                                <p><strong>Problem Description:</strong> {problemDescription && problemDescription}</p>
                            </>
                        )}
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>Waiting for the mechanic to respond...</p>
                        <button
                            onClick={() => setRequestSubmitted(false)}
                            style={{
                                padding: '8px 16px',
                                fontSize: '14px',
                                backgroundColor: '#dc3545',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'block',
                                margin: '0 auto'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Active Mechanics</h1>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {mechanics.map(mechanic => (
                            <li key={mechanic._id} style={{ border: '1px solid #ccc', borderRadius: '1em', marginBottom: '10px', padding: '15px' }}>
                                <h2 style={{ fontSize: '1.5em', marginBottom: '5px' }}>{mechanic.name}</h2>
                                <p><strong>Email:</strong> {mechanic.email}</p>
                                <p><strong>Contact Number:</strong> {mechanic.contactNumber}</p>
                                <p><strong>Experience:</strong> {mechanic.experience}</p>
                                <p><strong>Expertise:</strong> {mechanic.expertise}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                    {mechanic.requestedByUser ? (
                                        <button
                                            style={{
                                                padding: '8px 16px',
                                                fontSize: '14px',
                                                backgroundColor: '#ffc107',
                                                color: '#212529',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'not-allowed'
                                            }}
                                            disabled
                                        >
                                            Waiting for mechanic response
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleAcceptMechanic(mechanic)}
                                                style={{
                                                    padding: '8px 16px',
                                                    fontSize: '14px',
                                                    backgroundColor: loading ? '#ffc107' : '#28a745',
                                                    color: loading ? '#212529' : '#fff',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: loading ? 'not-allowed' : 'pointer'
                                                }}
                                                disabled={loading}
                                            >
                                                {loading ? <FaSpinner className="spin" /> : 'Accept'}
                                            </button>
                                            <button
                                                onClick={() => handleRejectMechanic(mechanic._id)}
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
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="problem-modal-title"
                aria-describedby="problem-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="problem-modal-title" variant="h6" component="h2">
                        Enter Problem Description
                    </Typography>
                    <TextField
                        id="problem-modal-description"
                        label="Describe the problem..."
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                        value={problemDescription}
                        onChange={(e) => setProblemDescription(e.target.value)}
                        margin="normal"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleSubmitRequest} variant="contained" color="primary" sx={{ mr: 1 }}>
                            Send Request
                        </Button>
                        <Button onClick={handleCloseModal} variant="contained" color="error">
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default ActiveMechanicsPage;
