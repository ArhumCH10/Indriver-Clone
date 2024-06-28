import React, { useEffect, useState } from 'react';
import HeaderUser from '../ui/HeaderUser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProfilePageUser() {

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    userType: '',
    otherInfo: ''
});
    
      useEffect(() => {
        // Retrieve user ID from local storage
        const user = localStorage.getItem('user');
        if(!user){
            return toast.error("User Not Found")
        }
        const userData = JSON.parse(user);

const userId = userData._id;
console.log("This is user id :",userId)
    
        fetchUserData(userId);
      }, []); 
    
      
      const fetchUserData = (userId) => {
        fetch(`http://localhost:8080/user/${userId}`)
          .then(response => response.json())
          .then(data => {
            setUserData(data);
            setContactNumber(data.contactNumber);
            setOtherInfo(data.otherInfo);
          })
          .catch(error => console.error('Error fetching user data:', error));
      };


  // const userData = {
  //   name: 'Arhum Naveed',
  //   email: 'arhumnaveed092@gmail.com',
  //   contactNumber: '03066116600',
  //   userType:'User',
  //   otherInfo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  // };

  
// useEffect(() => {
//   setContactNumber(userData.contactNumber);
//   setOtherInfo(userData.otherInfo);
// }, [userData]);

  const [contactNumber, setContactNumber] = useState(userData.contactNumber);
  const [otherInfo, setOtherInfo] = useState(userData.otherInfo);
  const [isEditingcontactNumber, setIsEditingcontactNumber] = useState(false);
  const [isEditingOtherInfo, setIsEditingOtherInfo] = useState(false);

  const handlecontactNumberChange = (event) => {
    setContactNumber(event.target.value);
  };

  const handleOtherInfoChange = (event) => {
    setOtherInfo(event.target.value);
  };

  const handleEditcontactNumberClick = () => {
    setIsEditingcontactNumber(true);
  };

  const handleEditOtherInfoClick = () => {
    setIsEditingOtherInfo(true);
  };

  const handleSavecontactNumberClick = () => {
    console.log("function started")
    setIsEditingcontactNumber(false);

    // Update user data with the new contact number
    setUserData(prevUserData => ({
      ...prevUserData,
      contactNumber: contactNumber
    }));
    console.log(userData)

    // Send PUT request to backend to update contact number
    fetch('http://localhost:8080/user/save-phone-number', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: userData._id, contactNumber: contactNumber })
    })
    .then(response => {
      if (!response.ok) {
        toast.error('Failed to update contact number');

        throw new Error('Failed to update contact number');
        
      }
      toast.success('Contact number updated successfully');
    })
    .catch(error => {
      console.error('Error updating contact number:', error);
      toast.error('Failed to update contact number');

    });
  };
  

  const handleSaveOtherInfoClick = () => {
    setIsEditingOtherInfo(false);
    // Here you can update the user data with the new other information
    console.log(otherInfo);
    // Update user data with the new contact number
    setUserData(prevUserData => ({
      ...prevUserData,
      otherInfo: otherInfo
    }));

    // Send PUT request to backend to update contact number
    fetch('http://localhost:8080/user/save-other-info', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: userData._id, otherInfo: otherInfo })
    })
    .then(response => {
      if (!response.ok) {
        toast.error('Failed to update other Info');

        throw new Error('Failed to update Info');
        
      }
      toast.success('Info updated successfully');
    })
    .catch(error => {
      console.error('Error updating Info:', error);
      toast.error('Failed to update Info');

    });
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#d3eef3',
    borderRadius: '10px',
    fontFamily: 'Arial, sans-serif',
    height: '100vh',
    alignItems: 'center',
  };

  const profileStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '70px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    width: '30%',
    marginRight: '20px',
    marginTop: '-20px'
  };

  const rightColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '65%'
  };

  const infoBoxStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    marginBottom: '20px'
  };

  const titleStyle = {
    margin: '0 0 10px 0'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const tableCellStyle = {
    padding: '5px 10px',
    borderBottom: '1px solid #ddd'
  };

  const buttonStyle = {
    marginLeft: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer'
  };

  const saveButtonStyle = {
    color: '#000',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft:"1em"
  };

  return (
    <>
      <HeaderUser />
      <div style={containerStyle}>
        <div style={profileStyle}>
          {/* Profile image and name */}
          <img
            src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1718110209~exp=1718113809~hmac=ec67b2dd63a23c871fd7368a086d245447fddcc4351dd0cbe2ebc988a2b5e360&w=740"
            alt="Profile"
            style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '10px' }}
          />
          <h2>{userData.name}</h2>
        </div>
        <ToastContainer/>
        <div style={rightColumnStyle}>
          <div style={infoBoxStyle}>
            <h3 style={titleStyle}>General Information</h3>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={tableCellStyle}>Email</td>
                  <td style={tableCellStyle}>
                    <input
                      type="text"
                      value={userData.email}
                      disabled
                      style={{ width: '100%', padding: '5px', border: 'none' }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={tableCellStyle}>Contact Number</td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
  type="text"
  value={contactNumber} // Change this line
  onChange={handlecontactNumberChange}
  disabled={!isEditingcontactNumber}
  style={{ width: '30%', padding: '5px', border: 'none' }}
/>

                      {isEditingcontactNumber ? (
                        <button style={saveButtonStyle} onClick={handleSavecontactNumberClick}>
                           <svg
                              width="24px" height="24px"
                              viewBox="0 0 32 32"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                              fill="#000000"
                            >
                              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                              <g id="SVGRepo_iconCarrier">
                                <title>save-floppy</title>
                                <desc>Created with Sketch Beta.</desc>
                                <defs></defs>
                                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                  <g id="Icon-Set" transform="translate(-152.000000, -515.000000)" fill="#000000">
                                    <path
                                      d="M171,525 C171.552,525 172,524.553 172,524 L172,520 C172,519.447 171.552,519 171,519 C170.448,519 170,519.447 170,520 L170,524 C170,524.553 170.448,525 171,525 L171,525 Z M182,543 C182,544.104 181.104,545 180,545 L156,545 C154.896,545 154,544.104 154,543 L154,519 C154,517.896 154.896,517 156,517 L158,517 L158,527 C158,528.104 158.896,529 160,529 L176,529 C177.104,529 178,528.104 178,527 L178,517 L180,517 C181.104,517 182,517.896 182,519 L182,543 L182,543 Z M160,517 L176,517 L176,526 C176,526.553 175.552,527 175,527 L161,527 C160.448,527 160,526.553 160,526 L160,517 L160,517 Z M180,515 L156,515 C153.791,515 152,516.791 152,519 L152,543 C152,545.209 153.791,547 156,547 L180,547 C182.209,547 184,545.209 184,543 L184,519 C184,516.791 182.209,515 180,515 L180,515 Z"
                                      id="save-floppy"
                                    ></path>
                                  </g>
                                </g>
                              </g>
                            </svg>
                        </button>
                      ) : (
                        <button style={buttonStyle} onClick={handleEditcontactNumberClick}>
                          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={tableCellStyle}>User Type</td>
                  <td style={tableCellStyle}>
                    <input
                      type="text"
                      value={userData.userType}
                      disabled
                      style={{ width: '100%', padding: '5px', border: 'none' }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={infoBoxStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <h3 style={titleStyle}>Other Information</h3>
  {isEditingOtherInfo ? (
    <button style={saveButtonStyle} onClick={handleSaveOtherInfoClick}>
      <svg
        width="24px" height="24px"
        viewBox="0 0 32 32"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        fill="#000000"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <title>save-floppy</title>
          <desc>Created with Sketch Beta.</desc>
          <defs></defs>
          <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Icon-Set" transform="translate(-152.000000, -515.000000)" fill="#000000">
              <path
                d="M171,525 C171.552,525 172,524.553 172,524 L172,520 C172,519.447 171.552,519 171,519 C170.448,519 170,519.447 170,520 L170,524 C170,524.553 170.448,525 171,525 L171,525 Z M182,543 C182,544.104 181.104,545 180,545 L156,545 C154.896,545 154,544.104 154,543 L154,519 C154,517.896 154.896,517 156,517 L158,517 L158,527 C158,528.104 158.896,529 160,529 L176,529 C177.104,529 178,528.104 178,527 L178,517 L180,517 C181.104,517 182,517.896 182,519 L182,543 L182,543 Z M160,517 L176,517 L176,526 C176,526.553 175.552,527 175,527 L161,527 C160.448,527 160,526.553 160,526 L160,517 L160,517 Z M180,515 L156,515 C153.791,515 152,516.791 152,519 L152,543 C152,545.209 153.791,547 156,547 L180,547 C182.209,547 184,545.209 184,543 L184,519 C184,516.791 182.209,515 180,515 L180,515 Z"
                id="save-floppy"
              ></path>
            </g>
          </g>
        </g>
      </svg>
    </button>
  ) : (
    <button style={buttonStyle} onClick={handleEditOtherInfoClick}>
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    </button>
  )}
</div>

            <textarea
  value={otherInfo}
  onChange={handleOtherInfoChange}
  disabled={!isEditingOtherInfo}
  style={{ width: '100%', height: 'auto', minHeight: '100px', padding: '5px', border: 'none' }}
/>
           
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePageUser;
