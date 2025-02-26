import React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapFilters from './MapFilters';
import { supabase } from '../config/supabase';

// Replace this with your Mapbox access token
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const Map = () => {
  const [arrests, setArrests] = useState([]);
  const [filteredArrests, setFilteredArrests] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [viewState, setViewState] = useState({
    latitude: 42.2,
    longitude: -71.8,
    zoom: 7.5,
    bearing: 0,
    pitch: 0
  });

  useEffect(() => {
    fetchArrests();
  }, []);

  const fetchArrests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ice_arrest_records')
        .select('*');

      if (error) throw error;

      setArrests(data || []);
      setFilteredArrests(data || []);
    } catch (err) {
      console.error('Error fetching arrests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    let filtered = [...arrests];

    // Date filter
    if (filters.date) {
      filtered = filtered.filter(arrest => {
        // Ensure we're comparing dates in the same format
        const filterDate = new Date(filters.date).toISOString().split('T')[0];
        const arrestDate = new Date(arrest.date_of_arrest).toISOString().split('T')[0];
        return arrestDate === filterDate;
      });
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(arrest => {
        // Make the comparison case-insensitive and handle variations
        const arrestLocation = arrest.location_of_arrest.toLowerCase();
        const filterLocation = filters.location.toLowerCase();
        
        // Handle special cases for courthouse locations
        if (filterLocation.includes('courthouse')) {
          if (filterLocation.includes('custody')) {
            return arrestLocation.includes('courthouse') && arrest.courthouse_reason?.includes('custody');
          } else if (filterLocation.includes('present')) {
            return arrestLocation.includes('courthouse') && !arrest.courthouse_reason?.includes('custody');
          }
          return arrestLocation.includes('courthouse');
        }
        
        return arrestLocation.includes(filterLocation);
      });
    }

    setFilteredArrests(filtered);
  };

  const getLocationType = (arrest) => {
    if (arrest.courthouse_reason?.includes('Courthouse(custody)')) {
      return 'courthouse-custody';
    } else if (arrest.courthouse_reason?.includes('Courthouse(not in custody)')) {
      return 'courthouse-no-custody';
    } else {
      return 'jail';
    }
  };

  const getMarkerColor = (type) => {
    switch (type) {
      case 'courthouse-custody':
        return '#FF4136';
      case 'courthouse-no-custody':
        return '#FF851B';
      case 'jail':
        return '#7A1CFF';
      default:
        return '#AAAAAA';
    }
  };

  if (loading) return <div>Loading arrests...</div>;
  if (error) return <div>Error loading data: {error}</div>;

  return (
    <div className="map-container">
      <MapFilters onFilterChange={handleFilterChange} />
      <ReactMapGL
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >


        {filteredArrests.map((arrest, index) => (
          <Marker
            key={index}
            latitude={Number(arrest.latitude)}
            longitude={Number(arrest.longitude)}
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setSelectedMarker(arrest);
            }}
          >
            <svg
              height={20}
              viewBox="0 0 24 24"
              style={{
                cursor: 'pointer',
                fill: getMarkerColor(getLocationType(arrest)),
                stroke: 'white',
                strokeWidth: '1px',
                transform: `translate(-10px,-20px)`
              }}
            >
              <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
            </svg>
          </Marker>
        ))}

        {selectedMarker && (
          <Popup
            latitude={Number(selectedMarker.latitude)}
            longitude={Number(selectedMarker.longitude)}
            onClose={() => setSelectedMarker(null)}
            closeButton={true}
            closeOnClick={false}
            anchor="top"
          >
            <div className="popup">
              <h3>{selectedMarker.location_of_arrest}</h3>
              <p>Date: {selectedMarker.date_of_arrest}</p>
              <p>Type: {selectedMarker.courthouse_reason || 'Jail'}</p>
              {selectedMarker.additional_info && (
                <p>Details: {selectedMarker.additional_info}</p>
              )}
            </div>
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
};

export default Map; 