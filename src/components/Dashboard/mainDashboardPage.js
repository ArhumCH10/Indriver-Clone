import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MainDashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/', { replace: true });
    console.log('User logged out.');
  };

  // useEffect to check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // No token found, navigate to the login page
      navigate('/', { replace: true });
    }
  }, [navigate]); // Navigate function as dependency

  return (
    <div >
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: '#BA0B0A',
          color: 'white',
          padding: '15px 30px',
          fontSize: '16px',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'background-color 0.3s ease',
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default MainDashboardPage;
