import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from 'react-leaflet';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ACCESS_TOKEN = 'pk.c3869e335c8c12695c653d2da61c24ff';

const markerIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41],
});

const destinationMarkerIcon = new L.Icon({
  iconUrl: process.env.PUBLIC_URL + '/assets/images/Destination_Marker.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  shadowSize: [41, 41],
});

const SetViewOnChange = ({ coords }) => {
  const map = useMap();

  useEffect(() => {
    if (coords && coords.lat && coords.lng) {
      map.flyTo(coords, 16, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [coords, map]);

  return null;
};

const PostMap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pickUp, setPickUp] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { userId, driverId } = location.state || {};

        if (!userId || !driverId) {
          toast.error('User or Driver ID is missing');
          return;
        }

        console.log('Fetching locations for:', { userId, driverId });

        const response = await axios.get(`http://localhost:8080/locations/${userId}/${driverId}`);
        const { userLocation, driverLocation } = response.data;

        console.log('Locations received:', { userLocation, driverLocation });

        setPickUp(userLocation);
        setDestination(driverLocation);

        const coordinates = `${userLocation.lng},${userLocation.lat};${driverLocation.lng},${driverLocation.lat}`;
        const routeResponse = await axios.get(`https://us1.locationiq.com/v1/directions/driving/${coordinates}?key=${ACCESS_TOKEN}&overview=full&geometries=geojson`);
        const routeData = routeResponse.data.routes[0].geometry.coordinates.map(coord => ({ lat: coord[1], lng: coord[0] }));
        setRoute(routeData);

        console.log('Route data:', routeData);
      } catch (error) {
        toast.error('Error fetching location or route data');
        console.error('Error:', error);
      }
    };

    fetchLocations();
  }, [location.state]);

  const handleCashPaid = async () => {
    try {
      const { userId, driverId } = location.state || {};
  
      if (!userId || !driverId) {
        toast.error('User or Driver ID is missing');
        return;
      }
  
      const response = await axios.put('http://localhost:8080/updateCashPaidStatus', { userId, driverId });
      if (response.status === 200) {
        toast.success('Cash Paid status updated successfully');
        
        setTimeout(() => {
          navigate('/userdashboard/dashboard', { state: { message: 'Order done successfully' } });
        }, 2000); // Delay navigation by 2 seconds to allow toast to display
      }
    } catch (error) {
      toast.error('Error updating cash paid status');
      console.error('Error:', error);
    }
  };  

  useEffect(() => {
    const handlePopState = (event) => {
      if (location.pathname === '/userdashboard/dashboard') {
        toast.error('Navigation back is restricted');
        navigate('/userdashboard/dashboard', { replace: true });
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location, navigate]);

  return (
    <div className="map-page">
      <ToastContainer />
      <MapContainer center={pickUp || [51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
        {pickUp && (
          <Marker position={pickUp} icon={markerIcon}>
            <Popup>Pick Up Location</Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={destination} icon={destinationMarkerIcon}>
            <Popup>Destination</Popup>
          </Marker>
        )}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
        {pickUp && <SetViewOnChange coords={pickUp} />}
      </MapContainer>
      <button onClick={handleCashPaid} className="cash-paid-button">
        Confirm Cash Paid
      </button>
    </div>
  );
};

export default PostMap;