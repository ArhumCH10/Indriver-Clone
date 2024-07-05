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
import ProfilePageUser from './components/Dashboard/ProfilePageUser';
import DriverStatusPage from './components/DashboardDriver/DriverStatusPage';
import Reserve from './components/Dashboard/Reserve';
import PostMap from './components/Dashboard/MapComponent';
import FindMechanicPage from './components/Dashboard/FindMechanicPage';
import ActiveMechanicsPage from './components/Dashboard/ActiveMechanicsPage';
import WaitingPage from './components/Dashboard/WaitingPage';

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/userdashboard/findMechanic" element={<FindMechanicPage />} />
        <Route path="/active-mechanics" element={<ActiveMechanicsPage />} />
        <Route path="/waiting" element={<WaitingPage/>} />

        <Route path="/userdashboard" element={<UserDashboardLinks />}>
          <Route path="dashboard/*" index element={<UserDashboardPage />} />
          <Route path="destination" element={<DestinationPage/>} />
          <Route path="reserve" element={<Reserve />} />
          <Route path="driver-status" element={<DriverStatusPage/>} />
          <Route path="map" element={<PostMap/>} />
        </Route>
        <Route path="/profile-page-user" element={<ProfilePageUser />} />


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