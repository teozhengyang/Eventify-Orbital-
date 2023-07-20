import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import DisplayActivity from "./DisplayActivity";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { AuthToken, AuthUser } from "../utils/Types";
import { useContext } from "react";
import "/static/css/event.css";

export default function Event() {
  // Get event data from EventDesc.tsx/PageProfile.tsx
  const location = useLocation();
  const event = location.state.evt;
  const { authTokens, user } = useContext(AuthContext) as { authTokens: AuthToken, user: AuthUser, }

  const navigate = useNavigate()

  const templateButton = (
    <Button onClick={() => {navigate('/NewEvent', {state:{evt:event}})}} disabled={!event.shared}>
      Use Template
    </Button>
  )

  useEffect(() => {
    getWeatherData()
    getComments()
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

  const [comments, setComments] = useState([])

  const getComments = async () => {
    const eventsResponse = await axios.get(`http://127.0.0.1:8000/comments/${event.id}`, config)
    setComments(eventsResponse.data)
  }

  // Headers for authorization @ backend => Allows Get/Post request for event data
  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const target = e.target as typeof e.target & {
        event: {value: number}
        text: {value: string}
      }
      const response = await axios.post(`http://127.0.0.1:8000/comments/${event.id}`, {
        event: event.id,
        text: target.text.value,
        created_at: new Date(),
      }, config);
      console.log(response.data)
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
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
          <p>Weather in {weatherData.location.name}, {weatherData.location.country}</p>
          <p>Temperature: {weatherData.current.temp_c}°C</p>
          <p>Description: {weatherData.current.condition.text}</p>
        </div>
      )}
      <hr />
      <DisplayActivity event={event}/>
      <hr />
      <h5>Comments</h5>
      <div className="grid-container">
      {comments.map((comment, i) => (
        <div key={i} className="grid-item">
          <p>Comment: {comment.text}</p>
          <p>Date created: {format(new Date(comment.created_at), "dd/MM/yyyy, p")}</p>
        </div>
      ))}
      </div>
      <br />
      <div>
        <form onSubmit={handleFormSubmit}>
          <div>
            <textarea name="text" placeholder="Write comment"/>
          </div>
          <Button type="submit">Add Comment</Button>
        </form>
      </div>
    </>
  );
}