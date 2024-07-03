import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeaderUser from '../ui/HeaderUser';
import Modal from './Modal'; // Assuming you have a Modal component
import { FaSpinner } from 'react-icons/fa'; // For loading spinner

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
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setRequestSubmitted(false);
    setSelectedMechanic(null);
    setProblemDescription('');
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

      // Log selectedMechanic here before submission
      console.log(selectedMechanic);

      await axios.post('http://localhost:8080/submit-request', requestData);

      setRequestSubmitted(true); // Set requestSubmitted to true after successful request submission

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

  if (requestSubmitted) {
    return (
      <>
        <HeaderUser />
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Waiting for Mechanic Response</h1>
          <div style={{ border: '1px solid #ccc', borderRadius: '1em', marginBottom: '10px', padding: '15px' }}>
            <h2 style={{ fontSize: '1.5em', marginBottom: '5px' }}>{selectedMechanic?.name}</h2>
            <p><strong>Email:</strong> {selectedMechanic?.email}</p>
            <p><strong>Contact Number:</strong> {selectedMechanic?.contactNumber}</p>
            <p><strong>Experience:</strong> {selectedMechanic?.experience}</p>
            <p><strong>Expertise:</strong> {selectedMechanic?.expertise}</p>
            <p><strong>Problem Description:</strong> {problemDescription}</p>
            <p style={{ textAlign: 'center', marginTop: '20px' }}>Waiting for the mechanic to respond...</p>
            <button
              onClick={handleCloseModal}
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
      </>
    );
  }

  return (
    <>
      <HeaderUser />
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
      <Modal isOpen={modalOpen} onClose={handleCloseModal} onSubmit={handleSubmitRequest}>
        <textarea
          value={problemDescription}
          onChange={(e) => setProblemDescription(e.target.value)}
          placeholder="Describe your problem..."
          style={{ width: '100%', height: '100px', resize: 'none', marginBottom: '10px' }}
        />
        <button
          onClick={handleSubmitRequest}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: loading ? '#ffc107' : '#28a745',
            color: loading ? '#212529' : '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
          disabled={loading || !problemDescription.trim()}
        >
          {loading ? <FaSpinner className="spin" /> : 'Submit Request'}
        </button>
      </Modal>
    </>
  );
};

export default ActiveMechanicsPage;
