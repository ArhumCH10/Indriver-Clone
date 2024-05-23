import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderUser from '../ui/HeaderUser';

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Main = styled.main`
  background-color: var(--color-grey-50);
  padding: 1rem 2rem 2.4rem;
  overflow-y: auto;
  flex: 1;
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

export default function UserDashboardLinks() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login', { replace: true });
    } else {
      switch (user.userType) {
        case 'user':
          // Allow access to this dashboard
          break;
        case 'driver':
          navigate('/driverdashboard', { replace: true });
          break;
        // Add more cases as needed for other user types
        default:
          navigate('/login', { replace: true });
          break;
      }
    }
  }, [navigate]);

  return (
    <StyledPage>
      <HeaderUser />
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledPage>
  );
}
