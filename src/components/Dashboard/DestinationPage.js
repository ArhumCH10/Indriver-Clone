import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./DestinationPage.css";
import { FaLocationCrosshairs } from "react-icons/fa6";

const ACCESS_TOKEN = 'pk.c3869e335c8c12695c653d2da61c24ff';
const AUTOCOMPLETE_URL = `https://us1.locationiq.com/v1/autocomplete?key=${ACCESS_TOKEN}&`;

const markerIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41]
});

const destinationMarkerIcon = new L.Icon({
  iconUrl: process.env.PUBLIC_URL + '/assets/images/Destination_Marker.png',
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

function AdjustZoomLevel({ route }) {
  const map = useMap();

  useEffect(() => {
    if (route) {
      const bounds = L.latLngBounds(route.map(coord => L.latLng(coord.lat, coord.lng)));
      map.flyToBounds(bounds, { animate: true, duration: 1.5 });
    }
  }, [route, map]);

  return null;
}

function MapComponent() {
  const [location, setLocation] = useState({ lat: 51.505, lng: -0.09 });
  const [address, setAddress] = useState('');
  const [pickUp, setPickUp] = useState('');
  const [destination, setDestination] = useState('');
  const [marker, setMarker] = useState(location);
  const [destinationMarker, setDestinationMarker] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [route, setRoute] = useState(null);
  const [drivers, setDrivers] = useState([]);

  const pickUpRef = useRef(null);
  const destinationRef = useRef(null);

  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (address) {
      axios.get(`https://us1.locationiq.com/v1/search?key=${ACCESS_TOKEN}&q=${address}&format=json`)
        .then(response => {
          const { lat, lon } = response.data[0];
          setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
          setMarker({ lat: parseFloat(lat), lng: parseFloat(lon) });
        })
        .catch(error => {
          console.error('Error fetching location data:', error);
        });
    }
  }, [address]);

  useEffect(() => {
    if (marker && destinationMarker) {
      const fetchRoute = async () => {
        try {
          const coordinates = `${marker.lng},${marker.lat};${destinationMarker.lng},${destinationMarker.lat}`;
          const response = await axios.get(`https://us1.locationiq.com/v1/directions/driving/${coordinates}?key=${ACCESS_TOKEN}&alternatives=false&steps=true&geometries=geojson&overview=full&annotations=true`);
          const routeData = response.data.routes[0];
          const coordinatesArray = routeData.geometry.coordinates.map(coord => ({ lat: coord[1], lng: coord[0] }));
          setRoute(coordinatesArray);
        } catch (error) {
          console.error('Error fetching route data:', error);
        }
      };
      fetchRoute();
    }
  }, [destinationMarker, marker]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickUpRef.current && !pickUpRef.current.contains(event.target)) {
        setSuggestions([]);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target)) {
        setDestinationSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pickUpRef, destinationRef]);

  const handleShowMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setMarker({ lat: latitude, lng: longitude });
        setDestinationMarker(null);
        setRoute(null);
        setDestination('');
        axios.get(`https://us1.locationiq.com/v1/reverse.php?key=${ACCESS_TOKEN}&lat=${latitude}&lon=${longitude}&format=json`)
          .then(response => {
            setAddress(response.data.display_name);
            setPickUp(response.data.display_name);
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

  const handleAddressChange = (e) => {
    const inputValue = e.target.value;
    setPickUp(inputValue);
    if (inputValue.length > 1) {
      axios.get(`${AUTOCOMPLETE_URL}q=${inputValue}&limit=5`)
        .then(response => {
          setSuggestions(response.data);
        })
        .catch(error => {
          console.error('Error fetching autocomplete suggestions:', error);
        });
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setAddress(suggestion.display_name);
    setPickUp(suggestion.display_name);
    setLocation({ lat: suggestion.lat, lng: suggestion.lon });
    setMarker({ lat: suggestion.lat, lng: suggestion.lon });
    setSuggestions([]);
  };

  const handleDestinationChange =
  (e) => {
    const inputValue = e.target.value;
    setDestination(inputValue);
    if (inputValue.length > 1) {
      axios.get(`${AUTOCOMPLETE_URL}q=${inputValue}&limit=5`)
        .then(response => {
          setDestinationSuggestions(response.data);
        })
        .catch(error => {
          console.error('Error fetching autocomplete suggestions:', error);
        });
    }
};

const handleDestinationSuggestionSelect = (suggestion) => {
  setDestination(suggestion.display_name);
  setDestinationMarker({ lat: suggestion.lat, lng: suggestion.lon });
  setDestinationSuggestions([]);
};


const handleSearch = async () => {
  if (!marker || !destinationMarker) {
    alert('Please set both pick-up and destination locations.');
    return;
  }
  const userString = localStorage.getItem('user');
  if (!userString) {
    toast.error('User is not authenticated');
    return;
  }

  const user = JSON.parse(userString);
  const userId = user._id;
  try {
    console.log('Fetching route and available drivers...');
    const coordinates = `${marker.lng},${marker.lat};${destinationMarker.lng},${destinationMarker.lat}`;
    const routeResponse = await axios.get(`https://us1.locationiq.com/v1/directions/driving/${coordinates}?key=${ACCESS_TOKEN}&overview=false&annotations=true`);
    const distance = routeResponse.data.routes[0].distance; 

    const driversResponse = await axios.get('http://localhost:8080/user/active-drivers');

    if (!Array.isArray(driversResponse.data)) {
      throw new Error("Expected an array of drivers");
    }

    const driversData = driversResponse.data.map(driver => ({
      ...driver,
      price: (distance / 1000) * 50, 
      pickUp,
      destination,
    }));

    console.log('Drivers data:', driversData);
    setDrivers(driversData);

    // Send user location and address to backend
    await axios.post('http://localhost:8080/user-location', {
      userId: userId, 
      address: pickUp,
      latitude: marker.lat,
      longitude: marker.lng,
    });

    navigate('/userdashboard/driver-status', { state: { drivers: driversData } });
  } catch (error) {
    console.error('Error fetching available drivers:', error);
  }
};

  return (
    <div>
       <ToastContainer />
      <div className="destination-container">
        <div className="destination-header">
          <FaArrowLeft size={20} className="back-icon" onClick={handleBackClick} />
          <div className="destination-inputs">
            <div ref={pickUpRef} style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                id="pick-up"
                placeholder="Enter pick-up location"
                value={pickUp}
                onChange={handleAddressChange}
                style={{ marginBottom: '10px', padding: '10px', borderColor: '#ccc', width: '100%' }}
              />
              {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map(suggestion => (
                    <li key={suggestion.place_id} onClick={() => handleSuggestionSelect(suggestion)}>
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div ref={destinationRef} style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                id="destination"
                placeholder="Enter destination"
                value={destination}
                onChange={handleDestinationChange}
                style={{ padding: '10px', borderColor: '#ccc', width: '100%' }}
              />
              {destinationSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {destinationSuggestions.map(suggestion => (
                    <li key={suggestion.place_id} onClick={() => handleDestinationSuggestionSelect(suggestion)}>
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <button className='find-driver-btn' onClick={handleSearch}>Find Car Owners</button>
        </div>
      </div>
      <MapContainer center={location} zoom={13} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={marker} icon={markerIcon}>
          <Popup>{address}</Popup>
        </Marker>
        {destinationMarker && (
          <Marker position={destinationMarker} icon={destinationMarkerIcon}>
            <Popup>{destination}</Popup>
          </Marker>
        )}
        {route && <Polyline positions={route} color="blue" />}
        <SetViewOnChange coords={location} />
        <AdjustZoomLevel route={route} />
      </MapContainer>
      <button onClick={handleShowMyLocation} className="my-location-button">
        <FaLocationCrosshairs size={30} />
      </button>
    </div>
  );
}

export default MapComponent;