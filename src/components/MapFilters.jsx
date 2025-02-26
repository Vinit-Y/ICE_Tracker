import React, { useState } from 'react';

const MapFilters = ({ onFilterChange }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const locationOptions = [
    "Car Stop",
    "Courthouse (Custody)",
    "Courthouse (Present, Not in Custody)",
    "Home",
    "Jail",
    "OTHER",
    "Police Precinct",
    "Probation/Parole Office",
    "Street",
    "Workplace"
  ];

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    onFilterChange({
      date: newDate,
      location: selectedLocation
    });
  };

  const handleLocationChange = (e) => {
    const newLocation = e.target.value;
    setSelectedLocation(newLocation);
    onFilterChange({
      date: selectedDate,
      location: newLocation
    });
  };

  return (
    <div className="map-filters">
      {/* Date Filter */}
      <div className="filter-group">
        <label>Filter by Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="filter-input"
        />
      </div>

      {/* Location Filter */}
      <div className="filter-group">
        <label>Filter by Location:</label>
        <select
          value={selectedLocation}
          onChange={handleLocationChange}
          className="filter-select"
        >
          <option value="">All Locations</option>
          {locationOptions.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MapFilters; 