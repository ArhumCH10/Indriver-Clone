import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Divider } from '@material-ui/core';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [mechanics, setMechanics] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [activeButton, setActiveButton] = useState('user');
    const [updateTrigger, setUpdateTrigger] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const adminLoggedIn = localStorage.getItem('adminloggedin');
        if (!adminLoggedIn) {
            navigate('/admin'); // Redirect to '/admin' if not logged in
        }
    }, [navigate]);

    useEffect(() => {
        fetchData();
    }, [updateTrigger]);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:8080/get-users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchDataMechanics();
    }, [updateTrigger]);

    const fetchDataMechanics = async () => {
        try {
            const response = await fetch('http://localhost:8080/get-mechanics');
            const data = await response.json();
            setMechanics(data);
        } catch (error) {
            console.error('Error fetching mechanics:', error);
        }
    };

    useEffect(() => {
        fetchDataDrivers();
    }, [updateTrigger]);

    const fetchDataDrivers = async () => {
        try {
            const response = await fetch('http://localhost:8080/get-drivers');
            const data = await response.json();
            setDrivers(data);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    const handleButtonClick = button => {
        setActiveButton(button);
        setUpdateTrigger(prev => !prev); // Trigger re-fetch on button click
    };

    const handleLogoutClick = () => {
        localStorage.removeItem('adminloggedin');
        navigate('/admin', { replace: true });
    };

    const handleVerifyUser = async userId => {
        try {
            await fetch(`http://localhost:8080/verify-user/${userId}`, {
                method: 'POST'
            });
            setUpdateTrigger(prev => !prev); // Trigger re-fetch on verification
        } catch (error) {
            console.error('Error verifying user:', error);
        }
    };

    const handleDelete = async (userId, userType) => {
        try {
            await fetch(`http://localhost:8080/delete-user/${userId}`, {
                method: 'DELETE'
            });
            setUpdateTrigger(prev => !prev); // Trigger re-fetch on delete
        } catch (error) {
            console.error(`Error deleting ${userType}:`, error);
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <p>Welcome! Admin</p>
            </header>
            <nav style={styles.nav}>
                <button
                    style={{
                        ...styles.userTypeButton,
                        backgroundColor: activeButton === 'user' ? '#5BA600' : ''
                    }}
                    onClick={() => handleButtonClick('user')}
                >
                    Users
                </button>
                <button
                    style={{
                        ...styles.userTypeButton,
                        backgroundColor: activeButton === 'mechanic' ? '#5BA600' : ''
                    }}
                    onClick={() => handleButtonClick('mechanic')}
                >
                    Mechanics
                </button>
                <button
                    style={{
                        ...styles.userTypeButton,
                        backgroundColor: activeButton === 'driver' ? '#5BA600' : ''
                    }}
                    onClick={() => handleButtonClick('driver')}
                >
                    Drivers
                </button>
                <button style={styles.navButton} onClick={handleLogoutClick}>
                    Logout
                </button>
            </nav>
            <main style={styles.main}>
                <div style={styles.tableContainer}>
                    <h2>{activeButton.charAt(0).toUpperCase() + activeButton.slice(1)} List</h2>
                    <Divider />
                    {activeButton === 'user' && (
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email address</th>
                                    <th>Verification Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.isVerified ? 'Verified' : 'Not Verified'}</td>
                                        <td>
                                            {!user.isVerified ? (
                                                <button
                                                    style={styles.verifyButton}
                                                    onClick={() => handleVerifyUser(user._id)}
                                                >
                                                    Verify
                                                </button>
                                            ) : (
                                                <button
                                                    style={styles.verifiedButton}
                                                    disabled
                                                >
                                                    Verified
                                                </button>
                                            )}
                                            <button
                                                style={styles.deleteButton}
                                                onClick={() => handleDelete(user._id, 'user')}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {activeButton === 'mechanic' && (
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email address</th>
                                    <th>Active Status</th>
                                    <th>Contact Number</th>
                                    <th>Experience</th>
                                    <th>Expertise</th>
                                    <th>Verify Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mechanics.map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.active ? 'Active' : 'Not Active'}</td>
                                        <td>{user.contactNumber}</td>
                                        <td>{user.experience}</td>
                                        <td>{user.expertise}</td>
                                        <td>{user.isVerified ? 'Verified' : 'Not Verified'}</td>
                                        <td>
                                            {!user.isVerified ? (
                                                <button
                                                    style={styles.verifyButton}
                                                    onClick={() => handleVerifyUser(user._id)}
                                                >
                                                    Verify
                                                </button>
                                            ) : (
                                                <button
                                                    style={styles.verifiedButton}
                                                    disabled
                                                >
                                                    Verified
                                                </button>
                                            )}
                                            <button
                                                style={styles.deleteButton}
                                                onClick={() => handleDelete(user._id, 'mechanic')}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {activeButton === 'driver' && (
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email address</th>
                                    <th>Active Status</th>
                                    <th>Vehicle ID</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {drivers.map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.active ? 'Active' : 'Not Active'}</td>
                                        <td>{user.vehicleId}</td>
                                        <td>
                                            {!user.isVerified ? (
                                                <button
                                                    style={styles.verifyButton}
                                                    onClick={() => handleVerifyUser(user._id)}
                                                >
                                                    Verify
                                                </button>
                                            ) : (
                                                <button
                                                    style={styles.verifiedButton}
                                                    disabled
                                                >
                                                    Verified
                                                </button>
                                            )}
                                            <button
                                                style={styles.deleteButton}
                                                onClick={() => handleDelete(user._id, 'driver')}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: 'Arial, sans-serif'
    },
    header: {
        backgroundColor: '#122550',
        color: '#fff',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    nav: {
        backgroundColor: '#444',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between'
    },
    navButton: {
        backgroundColor: '#122550',
        color: '#fff',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    userTypeButton: {
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    main: {
        padding: '1rem'
    },
    tableContainer: {
        marginTop: '1rem',
        backgroundColor: '#f4f4f4',
        padding: '1rem',
        borderRadius: '4px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    verifyButton: {
        backgroundColor: '#5BA600',
        color: '#fff',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '0.5rem'
    },
    verifiedButton: {
        backgroundColor: '#ccc',
        color: '#fff',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'not-allowed',
        marginRight: '0.5rem'
    },
    deleteButton: {
        backgroundColor: '#f44336',
        color: '#fff',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    }
};

export default AdminDashboard;