import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/pages/mainPage';
import SignupPage from './components/pages/signupPage'; // Corrected component name
import LoginPage from './components/pages/loginPage';
import UserDashboardPage from './components/Dashboard/userDashboardPage';
import GlobalStyle from './components/styles/GlobalStyle';
import DriverDashboardPage from './components/DashboardDriver/DriverDashboardPage';
import UserDashboardLinks from './components/Dashboard/UserDashboardLinks';
import DriverDashboardLinks from './components/DashboardDriver/DriverDashboardLinks';
import MechanicDashboardLinks from './components/MechanicDashboard/MechanicDashboardLinks';
import MechanicDashboardPage from './components/MechanicDashboard/MechanicDashboardPage';
import DestinationPage from './components/Dashboard/DestinationPage';

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/userdashboard" element={<UserDashboardLinks />}>
          <Route path="dashboard" index element={<UserDashboardPage />} />
          <Route path="destination" element={<DestinationPage/>} />
        </Route>

        <Route path="/driverdashboard" element={<DriverDashboardLinks/>}>
          <Route path="dashboard" index element={<DriverDashboardPage />} />
        </Route>
        <Route path="/mechanicdashboard" element={<MechanicDashboardLinks/>}>
          <Route path="dashboard" index element={<MechanicDashboardPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;