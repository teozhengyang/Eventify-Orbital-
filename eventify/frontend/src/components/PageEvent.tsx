import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import DisplayActivity from "./DisplayActivity";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { AuthToken, AuthUser, emptyUser } from "../utils/Types";
import { useContext } from "react";
import "/static/css/event.css";

export default function Event() {
  // Get event data from EventDesc.tsx/PageProfile.tsx
  const location = useLocation();
  const event = location.state.evt;
  const { authTokens, user } = useContext(AuthContext) as { authTokens: AuthToken, user: AuthUser, }
  const [currUser, setCurrUser] = useState(emptyUser)

  const navigate = useNavigate()

  const templateButton = (
    <Button onClick={() => {navigate('/NewEvent', {state:{evt:event}})}} disabled={!event.shared}>
      Use Template
    </Button>
  )

  useEffect(() => {
    getWeatherData()
    getComments()
    getCurrUser()
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

  const getCurrUser = async () => {
    // Somehow changing this to /api (proxy set in vite.config.ts) instead of the full address breaks the profile page
    const userResponse = await axios.get(`http://127.0.0.1:8000/user/${user.user_id}`, config);
    const userData = userResponse.data
    console.log(userData)
    setCurrUser(userData)
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const target = e.target as typeof e.target & {
        event: {value: number}
        text: {value: string}
      }
      const response = await axios.post(`http://127.0.0.1:8000/comments/${event.id}`, {
        event: event.id,
        creator: currUser.id,
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

      <div style={{display:"flex", flexDirection:"row"}}>
        <div style={{width:"50%", wordWrap:"break-word", paddingRight:"1em"}}>
          <p>Description:</p>
          <p style={{minHeight:"8em"}}>
            {event.description} 
          </p>
        </div>

        {weatherData && (
          <div>
            <p>3-Day forecast for {weatherData.location.name}, {weatherData.location.country}</p>
            {weatherData.current.condition.text}
            <p style={{fontSize:"50px"}}>{weatherData.current.temp_c}°C</p>
          </div>
        )}
      </div>

      <hr />
      <DisplayActivity event={event}/>

      <h5 style={{paddingTop:"3em"}}>Comments</h5>
      <div className="grid-container">
      {comments.map((comment, i) => (
        <div key={i} className="grid-item">
          <p className="comment-timestamp">Date created: {format(new Date(comment.created_at), "dd/MM/yyyy, p")}</p>
          <p>{comment.text}</p>
          {comment.creator === currUser && (<Button onClick={async() => {
                        const response = await axios.delete(`http://127.0.0.1:8000/comment/${comment.id}`, config)
                        console.log(response)
                        window.location.reload()
                      }}>
                        Delete
                      </Button>
          )} 
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