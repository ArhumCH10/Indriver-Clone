import React from 'react';
import styled from "styled-components";

const StyledLogo = styled.div`
  margin-left: 7px;
  display: flex;
`;

const Img = styled.img`
  height: 7.6rem;
  width: auto;
  cursor: pointer;
`;

const Heading = styled.h2`
      font-size: 2rem;
      font-weight: 600;
      font-family: 'Merriweather', serif;
      color: var(--color-grey-100);
      margin-top: 25px;
`;

export default function Logo1() {
  return (
    <StyledLogo>
        <Heading>Mobile Car Maintenance and Petrol Service</Heading>
    </StyledLogo>
  )
}