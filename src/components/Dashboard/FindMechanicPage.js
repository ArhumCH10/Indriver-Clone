import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaLocationArrow, FaSearch } from 'react-icons/fa';
import HeaderUser from '../ui/HeaderUser';

const ACCESS_TOKEN = 'pk.c3869e335c8c12695c653d2da61c24ff';

const markerIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41]
});

function SetViewOnChange({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 16, {
        animate: true,
        duration: 1.5
      });
    }
  }, [coords, map]);

  return null;
}

const FindMechanicPage = () => {
  const [location, setLocation] = useState({ lat: 51.505, lng: -0.09 });
  const [address, setAddress] = useState('');
  const [marker, setMarker] = useState(location);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setMarker({ lat: latitude, lng: longitude });
          axios.get(`https://us1.locationiq.com/v1/reverse.php?key=${ACCESS_TOKEN}&lat=${latitude}&lon=${longitude}&format=json`)
            .then(response => {
              setAddress(response.data.display_name);
            })
            .catch(error => {
              console.error('Error fetching address data:', error);
            });
        }, error => {
          console.error('Error getting geolocation:', error);
        });
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    };

    fetchUserLocation();
  }, []);

  const handleFindMechanic = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user._id;

      await axios.post('http://localhost:8080/save-location', {
        userId: userId,
        location: location
      });

      navigate('/active-mechanics');
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  return (
    <>
      <HeaderUser />
      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{ flex: 2, position: 'relative' }}>
          <MapContainer center={location} zoom={13} style={{ height: '80vh', width: '100%', borderRadius: "1.9em", margin: "1.6em 1em", border: "2px solid black" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={marker} icon={markerIcon}>
              <Popup>{address}</Popup>
            </Marker>
            <SetViewOnChange coords={location} />
          </MapContainer>
          <button
            onClick={() => setLocation(location)}
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              padding: '10px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              cursor: 'pointer'
            }}
          >
            <FaLocationArrow size={30} />
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button
            onClick={handleFindMechanic}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            <FaSearch size={20} /> Find Mechanic
          </button>
        </div>
      </div>
    </>
  );
};

export default FindMechanicPage;
