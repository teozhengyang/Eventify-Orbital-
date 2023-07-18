import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncSelect from 'react-select/async';

const API_KEY = '0c36bc53fdfe4278b3584452231107';
const API_BASE_URL = 'https://api.weatherapi.com/v1';

const WeatherApp = () => {

  type Location = {
    id: number,
    name: string,
    region: string,
    country: string,
    lat: number,
    lon: number,
    url: string
  }

  const emptyLocation:Location = {
    id: -1,
    name: "Enter",
    region: "a",
    country: "Location",
    lat: -1,
    lon: -1,
    url: ""
  }


  const [inputLocation, setInputLocation] = useState("")
  const [selectedLocation, setSelectedLocation] = useState(emptyLocation)


  const searchLocation = (inputValue: string) => {
    return axios.get(`${API_BASE_URL}/search.json`, {
      params: {
        key: API_KEY,
        q: inputValue,
      },
    }).then((response) => {
      return response.data
    }).catch((error) => {
      console.error('Error fetching possible locations:', error);
    });
  };

 
/*
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
*/

  // handle input change event
  const handleInputChange = (value:string) => {
    setInputLocation(value);
  };

  // handle selection
  const handleChange = (value) => {
    setSelectedLocation(value);
  }

  return (
    <div style={{color:"black"}}>
      <AsyncSelect 
        cacheOptions 
        defaultOptions 
        value={selectedLocation}
        getOptionLabel={(option) => option.name.concat(", ", option.region, ", ", option.country)}
        getOptionValue={(option) => option.name}
        loadOptions={searchLocation}
        onInputChange={handleInputChange}
        onChange={handleChange}
      />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div style={{color:"white"}}>
        <h1>Typed Input: {inputLocation}</h1>
        <h1>Selected Option: {selectedLocation && (selectedLocation.name + ", " + selectedLocation.country)}</h1>
      </div>
    </div>
  );
};

export default WeatherApp;
