import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'; 
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
      });
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    
      const handleLogin = async (e) => {
        e.preventDefault();
      
        const { email, password } = formData;
      
        if (!email || !password) {
          toast.error('Please fill out all required fields.');
          return;
        }
      
        try {
          const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
      
          if (response.ok) {
            const data = await response.json();
            // Save user object and token to local storage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
 
            const user = data.user;
            if (user.userType === 'user') {
              toast.success('Login successful!');
              navigate('/userdashboard/dashboard');
            } else if (user.userType === 'driver')
              {
                toast.success('Login successful!');
                navigate('/driverdashboard/dashboard');
              }
              else if (user.userType === 'mechanic')
                {
                  toast.success('Login successful!');
                  navigate('/mechanicdashboard/dashboard');
                }
            else {
              toast.error('Unknown user type.');
            }
            
          } else {
            const errorData = await response.json();
            toast.error(errorData.error || 'Login failed.');
          }
        } catch (error) {
          console.error('Login error:', error.message);
          toast.error('An error occurred during login.');
        }
      
        // Reset form data after login attempt
        setFormData({
          email: '',
          password: '',
        });
      };
      

      
      const handleButtonClick = (type) => {
        // Handle button click based on type (1, 2, 3)
        console.log(`Button ${type} clicked`);
    
        // Navigate to "/" route when Cancel button is clicked
        if (type === 'cancel') {
          navigate('/'); // Navigate to the root route ("/")
        }
      };


  return (
    <div style={container}>
    <div style={buttonGroupStyle}>
    <button onClick={() => handleButtonClick(1)} style={{
            ...buttonStyle,
            borderRadius: '30px 30px 0px 0px',    marginLeft:"-240px"
          }}>
          Mobile Car Maintenance and Petrol Service
        </button>
        </div>

    <div style={formContainer}>
    <div style={imageContainer}>
      <img
        src="https://img.freepik.com/free-vector/tablet-login-concept-illustration_114360-7883.jpg?t=st=1714821492~exp=1714825092~hmac=a0a96bf3e0e87c366e8a45a691a5cf3677df87bb1a3e0d9b295e8a1c78c49cfa&w=740"
        alt="signup"
        style={imageStyle}
      />
    </div>
    <div style={formContent}>
    <ToastContainer />
      <form onSubmit={handleLogin}>
       
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          variant="outlined"    
          value={formData.email}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          value={formData.password}
          onChange={handleInputChange}
          style={inputStyle}
        />
       
        <div style={buttonContainer}>
          <Button  type="submit" variant="contained" color="primary" style={buttonStyle}>
            Login
          </Button>
          <Button           onClick={() => handleButtonClick('cancel')}
 type="button" variant="contained" color="default" style={buttonStyle}>
            Cancel
          </Button>
     
        </div>
      </form>
    </div>
  </div>
  </div>
  )
}

const container = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#0E1A30',
    padding: '20px',
  };
  
  
  
  const buttonStyle = {
    padding: '10px 20px',
    margin: '0 10px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: 'white',
    border: 'none',
    cursor: 'pointer',
    color:"white",
    background:"#BA0B0A"
  
  };
  const buttonGroupStyle = {
      display: 'flex',
      justifyContent: 'center', // Center the buttons horizontally
      marginTop:"20px",
      
    };
  
  const formArea = {
    display: 'flex',
    justifyContent: 'center',
    
  };
  
  const formContainer = {
  
    display: 'flex',
    width: '60%',
    margin: '0 auto',
    border:"1px solid black",
    background:"white",
    borderRadius:"20px",
    padding:"10px",
    marginTop:"0px",
    minHeight: '55vh',
    border:"5px solid #BA0B0A",


  
  };
  
  const imageContainer = {
      flex: '1',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };
  
    const imageStyle = {
      maxWidth: '100%', // Increase the size of the image
      height: 'auto',
    };
  
  const formContent = {
    flex: '2',
    padding: '20px',
  };
  
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    
  };
  
  const inputStyle = {
    marginBottom: '15px',
    padding: '10px',
    fontSize: '16px',
  };
  
  const buttonContainer = {
    marginTop: '20px',
  };
  
  
export default LoginPage