import { useState } from 'react';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import { Button, Form } from 'react-bootstrap';
import { emptyLocation, Location } from '../utils/Types';

const API_KEY = '0c36bc53fdfe4278b3584452231107';
const API_BASE_URL = 'https://api.weatherapi.com/v1';

const WeatherApp = () => {


  const [inputLocation, setInputLocation] = useState("")
  const [selectedLocation, setSelectedLocation] = useState(emptyLocation)
  const [currentWeather, setCurrentWeather] = useState(null)

  const weatherInfo = currentWeather == null
    ? <p>No Location selected</p> 
    : (<p>Current Weather: {currentWeather.current.condition.text}</p>)

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

  

  const getWeatherData = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await axios.get(`${API_BASE_URL}/current.json`, {
        params: {
          key: API_KEY,
          q: selectedLocation.name,
        },
      })
      setCurrentWeather(response.data)
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching weather data:', error);
    };
  };


  // handle input change event
  const handleInputChange = (value:string) => {
    setInputLocation(value);
  };

  const handleChange = (option: Location | null) => {
    if (option) {
      setSelectedLocation(option)
    }
  }

  return (
    <div style={{color:"black"}}>
      <Form onSubmit={getWeatherData}>
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
        <Button variant="primary" type="submit">Get weather</Button>
      </Form>

      {weatherInfo}
      
    </div>
  );
};

export default WeatherApp;
