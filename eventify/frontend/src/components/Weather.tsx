import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const API_KEY = '0c36bc53fdfe4278b3584452231107';
const API_BASE_URL = 'https://api.weatherapi.com/v1';

const WeatherApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [possibleLocations, setPossibleLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
    searchLocation(value);
  };

  const searchLocation = (query) => {
    axios
      .get(`${API_BASE_URL}/search.json`, {
        params: {
          key: API_KEY,
          q: query,
        },
      })
      .then((response) => {
        setPossibleLocations(response.data);
      })
      .catch((error) => {
        console.error('Error fetching possible locations:', error);
      });
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    getWeatherData(location.id);
  };

  const getWeatherData = (locationId) => {
    axios
      .get(`${API_BASE_URL}/current.json`, {
        params: {
          key: API_KEY,
          q: locationId,
        },
      })
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  };

  return (
    <div>
      <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Enter a location" />
      <Select
              options={possibleLocations}
              placeholder="Search location"
              getOptionLabel={(option) => option.name.concat(", ", option.region, ", ", option.country)}
              getOptionValue={(option) => option.name}
              onChange={location => setPossibleLocations(location)}
              isSearchable={true}
            />
      <div>
        {possibleLocations.map((location) => (
          <div key={location.id} onClick={() => handleLocationClick(location)}>
            {location.name}, {location.region}, {location.country}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherApp;
