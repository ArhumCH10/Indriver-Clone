import React from 'react';
import styled from "styled-components";
import HeaderMenu from "./HeaderMenu";
import UserAvatar from "./UserAvatar";

const StyledHeader = styled.header`
  background-color: #b91c1c; 
  padding: 1.2rem 3rem;
  border-bottom: 1px solid #f3f4f6;

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
