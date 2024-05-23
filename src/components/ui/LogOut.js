import React, { useEffect } from 'react';
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import ButtonIcon from "./ButtonIcon";
import { useNavigate } from "react-router-dom";

export default function LogOut() {
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
    <ButtonIcon>
      <HiArrowRightOnRectangle onClick={handleLogout} />
    </ButtonIcon>
  );
}
