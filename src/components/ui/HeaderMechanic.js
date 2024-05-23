import React from 'react';
import styled from "styled-components";
import MechanicAvatar from "./MechanicAvatar";
import MechanicHeaderMenu from "./MechanicHeaderMenu";

const StyledHeader = styled.header`
  background-color: var(--color-red-700);
  padding: 1.2rem 3rem;
  border-bottom: 1px solid var(--color-grey-100);

  display: flex;
  gap: 2.4rem;
  align-items: end;
  justify-content: space-between; /* Changed from flex-end to space-between */
`;

export default function HeaderMechanic() {
  return (
    <StyledHeader>
      <MechanicAvatar/> 
      <MechanicHeaderMenu/> 
    </StyledHeader>
  );
}
