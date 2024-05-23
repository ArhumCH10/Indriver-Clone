import React from 'react';
import styled from "styled-components"
import ButtonIcon from "./ButtonIcon";
import { HiOutlineUser } from "react-icons/hi2";
import { HiOutlineBell } from 'react-icons/hi';
import LogOut from "./LogOut";
//import { useNavigate } from "react-router-dom";

const StyledHeaderMenu = styled.ul`
    display: flex;
    gap: 0.4rem;
    text-decoration: none;
    list-style: none;
`;

export default function DriverHeaderMenu() {
   // const navigate = useNavigate();
  return (
   <StyledHeaderMenu>
   <li>
        <ButtonIcon>
            <HiOutlineBell />
        </ButtonIcon>
    </li>
    <li>
        <ButtonIcon>
            <HiOutlineUser />
        </ButtonIcon>
    </li>
        <li>
        <LogOut/>
        </li>
   </StyledHeaderMenu>
  )
}