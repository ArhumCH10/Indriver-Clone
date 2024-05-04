import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/pages/mainPage';
import SignupPage from './components/pages/signupPage'; // Corrected component name
import LoginPage  from './components/pages/loginPage'
import MainDashboardPage from './components/Dashboard/mainDashboardPage'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<SignupPage />} /> 
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/dashboard" element={<MainDashboardPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
