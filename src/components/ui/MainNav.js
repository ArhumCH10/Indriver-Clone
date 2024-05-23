import React from 'react';
import { NavLink } from "react-router-dom"; 
import styled from "styled-components";
import { HiOutlineHome } from 'react-icons/hi2'

// Define your styled components
const NavList = styled.ul`
 display: flex;
  flex-direction: column;
  gap: 0.2rem;
  list-style-type: none;
  text-decoration: none;
`;

const StyledLink = styled(NavLink)` 
  display: flex;
  gap: 1.5rem;
  color: var(--color-grey-600);
  font-size: 1.6rem;
  font-weight: 500;
  padding: 1.2rem 2.4rem;
  transition: all 0.3s;
  text-decoration: none;
  font-family: "Poppins", sans-serif;

  /* This works because react-router places the active class on the active NavLink */
  &:hover,
  &:active,
  &.active {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-800);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active svg {
    color: var(--color-brand-600);
  }
`;

export default function MainNav() {
  return (
    <nav>
      <NavList>
        <li>
          <StyledLink to="/userdashboard/dashboard">
            <HiOutlineHome/>
            <span>
            Dashboard
            </span>
          </StyledLink>
        </li>

      </NavList>
    </nav>
  );
}