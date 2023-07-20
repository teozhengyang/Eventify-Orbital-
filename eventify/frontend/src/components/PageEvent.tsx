import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import DisplayActivity from "./DisplayActivity";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Event() {
  // Get event data from EventDesc.tsx/PageProfile.tsx
  const location = useLocation();
  const event = location.state.evt;

  const navigate = useNavigate()

  const templateButton = (
    <Button onClick={() => {navigate('/NewEvent', {state:{evt:event}})}} disabled={!event.shared}>
      Use Template
    </Button>
  )

  useEffect(() => {
    getWeatherData()
  },[])

  const [weatherData, setWeatherData] = useState(null);
  const apiKey = '0c36bc53fdfe4278b3584452231107'; 

  const getWeatherData = async () => {
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${event.location}&days=3`;
    await axios.get(url)
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  };

  return (
    <>
      <h3 style={{marginTop:"20px"}}>{event.name}</h3>
      {event.shared && templateButton}
      <hr />
      <p>{format(new Date(event.start), "dd/MM/yyyy, p")} - {format(new Date(event.end), "dd/MM/yyyy, p")}</p>
      <p>Location: {event.location}</p>
      <hr />
      <p>Description:</p>
      <p style={{minHeight:"8em"}}>
        {event.description} 
        <br /> <br /> 
      </p>
      <hr />
      {weatherData && (
        <div>
          <h5>Weather in {weatherData.location.name}, {weatherData.location.country}</h5>
          <p>Temperature: {weatherData.current.temp_c}°C</p>
          <p>Description: {weatherData.current.condition.text}</p>
        </div>
      )}
      <hr />
      <DisplayActivity event={event}/>
    </>
  );
}