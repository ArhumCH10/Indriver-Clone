import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the admin is already logged in
    if (localStorage.getItem('adminloggedin') === 'true') {
      navigate('/admin-dashboard');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin' && password === 'admin') {
      localStorage.setItem('adminloggedin', 'true');
      navigate('/admin-dashboard');
    } else {
      toast.error('Invalid login credentials');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.imageContainer}>
        <img
          src="https://img.freepik.com/premium-vector/concept-renting-buying-car-man-with-laptop-which-site-about-car_531064-7593.jpg?w=826"
          alt="Man with laptop"
          style={styles.image}
        />
      </div>
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <div style={styles.logo}>
            <ToastContainer />
            <h1 style={styles.logoText}>ADMIN LOGIN</h1>
          </div>
          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <button type="submit" style={styles.button}>
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#fff',
    margin: 0,
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginBottom: '2rem',
  },
  image: {
    maxWidth: '40%',
    borderRadius: '8px',
  },
  loginContainer: {
    maxWidth: '400px',
    width: '100%',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
  },
  loginBox: {
    backgroundColor: '#fff',
    padding: '3rem',
    borderRadius: '8px',
    marginTop:"-80px"
  },
  logo: {
    marginBottom: '1rem',
  },
  logoText: {
    margin: 0,
    fontSize: '1.5rem',
    color: 'black',
  },
  inputGroup: {
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#000',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default AdminLogin;
