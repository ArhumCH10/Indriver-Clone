import styled from "styled-components";
import { useState, useEffect } from "react";

const StyledUserAvatar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: start;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const Heading = styled.h3`
  font-size: 1.7rem;
  font-weight: 600;
  color: var(--color-grey-100);
  margin-top: 3px;
`;

export default function DriverAvatar() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Get the user object from local storage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      // Update the user name and level in state
      setUserName(storedUser.name);
    }
  }, []);

  return (
    <StyledUserAvatar>
      {/* Display the user name and level */}
      <Heading>Welcome, {userName || "Guest"}</Heading>
    </StyledUserAvatar>
  );
}
