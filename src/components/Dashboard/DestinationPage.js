import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import axios from 'axios';
import './MapComponent.css';
import { FaArrowLeft } from "react-icons/fa";
import "./DestinationPage.css";

// Fix the default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapComponent = () => {
  const [position, setPosition] = useState([51.505, -0.09]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const mapRef = useRef();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // This will navigate back to the previous page
  };

  const getCoordinates = async (place) => {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: place,
        format: 'json',
        limit: 1
      }
    });
    if (response.data.length > 0) {
      return [response.data[0].lat, response.data[0].lon];
    }
    return null;
  };

  const handleRoute = () => {
    if (mapRef.current && startCoords && endCoords) {
      const map = mapRef.current;
      L.Routing.control({
        waypoints: [
          L.latLng(startCoords[0], startCoords[1]),
          L.latLng(endCoords[0], endCoords[1])
        ],
        routeWhileDragging: true,
      }).addTo(map);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      });
    }
  }, []);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (start && end) {
        const startCoords = await getCoordinates(start);
        const endCoords = await getCoordinates(end);
        setStartCoords(startCoords);
        setEndCoords(endCoords);
      }
    };
    fetchCoordinates();
  }, [start, end]);

  useEffect(() => {
    if (startCoords && endCoords) {
      handleRoute();
    }
  }, [startCoords, endCoords]);

  const handleShowMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        setStartCoords([latitude, longitude]);
        setStart(`Lat: ${latitude}, Lon: ${longitude}`);
      });
    }
  };

  return (
    <>
      <div className="destination-container">
        <div className="destination-header">
          <FaArrowLeft
            size={20}
            className="back-icon"
            onClick={handleBackClick}
          />
          <div className="destination-inputs">
            <input
              type="text"
              placeholder="Enter pick-up location"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
            <input
              type="text"
              placeholder="Where to?"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
          <button onClick={handleShowMyLocation}>Show My Location</button>
        </div>
        <MapContainer center={position} zoom={13} className="map" ref={mapRef}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {startCoords && (
            <Marker position={startCoords}>
              <Popup>
                {start}
              </Popup>
            </Marker>
          )}
          <Marker position={position}>
            <Popup>
              You are here
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </>
  );
};

export default MapComponent;
