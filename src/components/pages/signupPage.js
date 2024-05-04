import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'; 
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUpForm1 = () => {
    const navigate = useNavigate(); // Access the useNavigate hook

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    
      const handleSignUp = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
      
        // Access form data from formData state
        const { name, email, password, confirmPassword } = formData;
      
        // Validate form fields
        if (!name || !email || !password || !confirmPassword) {
          toast.error('Please fill out all required fields.');
          return;
        }
      
        // Validate password criteria
        if (password.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
          toast.error('Password must be at least 8 characters long and contain a special character.');
          return;
        }
      
        // Check if passwords match
        if (password !== confirmPassword) {
          toast.error('Passwords do not match.');
          return;
        }
        let userType = 'user'; // Change this to your desired hardcoded value

        // Send signup request to backend
        try {
          const response = await fetch('http://localhost:8080/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, confirmPassword, userType }),
        });
      
          if (response.ok) {
            toast.success('Sign up successful!');
            navigate("/login")   
            // Optionally redirect or perform other actions after successful sign-up
          } else {
            const data = await response.json();
            toast.error(data.error || 'Sign up failed.');
          }
        } catch (error) {
          console.error('Sign up error:', error.message);
          toast.error('An error occurred during sign up.');
        }
      
        // Reset form data after signup (whether successful or not)
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
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
    <div style={formContainer}>
    <div style={imageContainer}>
      <img
        src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?t=st=1714811298~exp=1714814898~hmac=c9ec0d2fd83d5e02c438d858f2c0f3e50a4a7c72c9c797f3f801844df753ad70&w=740"
        alt="signup"
        style={imageStyle}
      />
    </div>
    <div style={formContent}>
    <h2 style={{color:"#0E1A30",margin:"0px 10px"}}>User</h2>
      <form onSubmit={handleSignUp}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          variant="outlined"
          value={formData.name}
          onChange={handleInputChange}
          style={inputStyle}
        />
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
        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          variant="outlined"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <div style={buttonContainer}>
          <Button  type="submit" variant="contained" color="primary" style={buttonStyle}>
            Sign Up
          </Button>
          <Button           onClick={() => handleButtonClick('cancel')}
 type="button" variant="contained" color="default" style={buttonStyle}>
            Cancel
          </Button>
         
        </div>
      </form>
    </div>
  </div>
  );
};

const SignUpForm2 = () => {
    const navigate = useNavigate(); // Access the useNavigate hook

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    
      const handleSignUp = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
      
        // Access form data from formData state
        const { name, email, password, confirmPassword } = formData;
      
        // Validate form fields
        if (!name || !email || !password || !confirmPassword) {
          toast.error('Please fill out all required fields.');
          return;
        }
      
        // Validate password criteria
        if (password.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
          toast.error('Password must be at least 8 characters long and contain a special character.');
          return;
        }
      
        // Check if passwords match
        if (password !== confirmPassword) {
          toast.error('Passwords do not match.');
          return;
        }
        let userType = 'mechanic'; // Change this to your desired hardcoded value

        // Send signup request to backend
        try {
          const response = await fetch('http://localhost:8080/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, confirmPassword, userType }),
        });
      
          if (response.ok) {
            toast.success('Sign up successful!');
            navigate("/login")   
            // Optionally redirect or perform other actions after successful sign-up
          } else {
            const data = await response.json();
            toast.error(data.error || 'Sign up failed.');
          }
        } catch (error) {
          console.error('Sign up error:', error.message);
          toast.error('An error occurred during sign up.');
        }
      
        // Reset form data after signup (whether successful or not)
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      };
  return (
    <div style={formContainer}>
    <div style={imageContainer}>
      <img
        src="https://img.freepik.com/premium-vector/car-service-illustration-concept_701961-6067.jpg?w=900"
        alt="signup"
        style={imageStyle}
      />
    </div>
    <div style={formContent}>
    <h2 style={{color:"#0E1A30",margin:"0px 10px"}}>Mechanic</h2>
      <form onSubmit={handleSignUp}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          variant="outlined"
          value={formData.name}
          onChange={handleInputChange}
          style={inputStyle}
        />
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
        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          variant="outlined"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <div style={buttonContainer}>
          <Button   type="submit" variant="contained" color="primary" style={buttonStyle}>
            Sign Up
          </Button>
          <Button           onClick={() => handleButtonClick('cancel')}
 type="button" variant="contained" color="default" style={buttonStyle}>
            Cancel
          </Button>
        
        </div>
      </form>
    </div>
  </div>
  );
};

const SignUpForm3 = () => {
    const navigate = useNavigate(); // Access the useNavigate hook

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    
      const handleSignUp = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
      
        // Access form data from formData state
        const { name, email, password, confirmPassword } = formData;
      
        // Validate form fields
        if (!name || !email || !password || !confirmPassword) {
          toast.error('Please fill out all required fields.');
          return;
        }
      
        // Validate password criteria
        if (password.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
          toast.error('Password must be at least 8 characters long and contain a special character.');
          return;
        }
      
        // Check if passwords match
        if (password !== confirmPassword) {
          toast.error('Passwords do not match.');
          return;
        }
        let userType = 'driver'; // Change this to your desired hardcoded value

        // Send signup request to backend
        try {
          const response = await fetch('http://localhost:8080/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, confirmPassword, userType }),
        });
      
          if (response.ok) {
            toast.success('Sign up successful!');
navigate("/login")          } else {
            const data = await response.json();
            toast.error(data.error || 'Sign up failed.');
          }
        } catch (error) {
          console.error('Sign up error:', error.message);
          toast.error('An error occurred during sign up.');
        }
      
        // Reset form data after signup (whether successful or not)
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
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
    <div style={formContainer}>
    <div style={imageContainer}>
      <img
        src="https://img.freepik.com/premium-vector/vector-illustration-car-buying-concept-with-client-happy-buy-new-car_675567-4243.jpg?w=900"
        alt="signup"
        style={imageStyle}
      />
    </div>
    <div style={formContent}>
    <h2 style={{color:"#0E1A30",margin:"0px 10px"}}>Driver</h2>
      <form onSubmit={handleSignUp}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          variant="outlined"
          value={formData.name}
          onChange={handleInputChange}
          style={inputStyle}
        />
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
        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          variant="outlined"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          style={inputStyle}
        />
        <div style={buttonContainer}>
          <Button  type="submit" variant="contained" color="primary" style={buttonStyle}>
            Sign Up
          </Button>
          <Button           onClick={() => handleButtonClick('cancel')}
 type="button" variant="contained" color="default" style={buttonStyle}>
            Cancel
          </Button>
     
        </div>
      </form>
    </div>
  </div>
  );
};

const SignUpForms = () => {
  const [activeForm, setActiveForm] = useState(1);

  const handleButtonClick = (formNum) => {
    setActiveForm(formNum);
  };

  return (
    <div style={container}>
      <div style={buttonGroupStyle}>
      <ToastContainer />

        <button onClick={() => handleButtonClick(1)} style={{
            ...buttonStyle,
            borderRadius: '30px 30px 0px 0px',marginLeft:"-440px" // Upper left and upper right corners rounded
          }}>
          SignUp As User
        </button>
        <button onClick={() => handleButtonClick(2)}  style={{
            ...buttonStyle,
            borderRadius: '30px 30px 0px 0px', // Upper left and upper right corners rounded
          }}>
          SignUp As Mechanic
        </button>
        <button
          onClick={() => handleButtonClick(3)}
          style={{
            ...buttonStyle,
            borderRadius: '30px 30px 0px 0px', // Upper left and upper right corners rounded
          }}
        >
          SignUp As Driver
        </button>
      </div>
      <div style={formArea}>
        {activeForm === 1 && <SignUpForm1 />}
        {activeForm === 2 && <SignUpForm2 />}
        {activeForm === 3 && <SignUpForm3 />}
      </div>
    </div>
  );
};

const container = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#D52B27',
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
  background:"#0E1A30"


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
  width: '80%',
  margin: '0 auto',
  border:"5px solid #0E1A30",
  background:"white",
  borderRadius:"20px",
  padding:"10px"

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

export default SignUpForms;
