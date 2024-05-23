import React from 'react';
import styled from "styled-components";
import HeaderMenu from "./HeaderMenu";
import UserAvatar from "./UserAvatar";

const StyledHeader = styled.header`
  background-color: var(--color-red-700);
  padding: 1.2rem 3rem;
  border-bottom: 1px solid var(--color-grey-100);

  display: flex;
  gap: 2.4rem;
  align-items: end;
  justify-content: space-between; /* Changed from flex-end to space-between */
`;

export default function HeaderUser() {
  return (
    <StyledHeader>
      <UserAvatar/> 
      <HeaderMenu/> 
    </StyledHeader>
  );
}
