import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DisplayActivity from "./DisplayActivity";
import AuthContext from "../context/AuthContext";
import { Button } from "react-bootstrap";
import { format } from "date-fns";
import { Comment, WeatherDate, AuthToken, AuthUser, emptyUser } from "../utils/Types";
import "/static/css/event.css";

export default function Event() {
  // Get event data from EventDesc.tsx/PageProfile.tsx
  const location = useLocation();
  const event = location.state.evt;
  const { authTokens, user } = useContext(AuthContext) as { authTokens: AuthToken, user: AuthUser, }
  const [currUser, setCurrUser] = useState(emptyUser)
  const [comments, setComments] = useState<Array<Comment>>([])

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


  const [weatherData, setWeatherData] = useState<Array<WeatherDate>>([]);
  const apiKey = '0c36bc53fdfe4278b3584452231107'; 

  const getWeatherData = async () => {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${event.location}&days=3`;
    await axios.get(url)
      .then((response) => {
        setWeatherData(response.data.forecast.forecastday);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  };

  const getComments = async () => {
    const eventsResponse = await axios.get(`https://eventify-n2c5.onrender.com/comments/${event.id}`, config)
    setComments(eventsResponse.data)
  }

  // Headers for authorization @ backend => Allows Get/Post request for event data
  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

  const getCurrUser = async () => {
    const userResponse = await axios.get(`https://eventify-n2c5.onrender.com/user/${user.user_id}`, config);
    const userData = userResponse.data
    setCurrUser(userData)
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const target = e.target as typeof e.target & {
        event: {value: number}
        text: {value: string}
      }
      const response = await axios.post(`https://eventify-n2c5.onrender.com/comments/${event.id}`, {
        event: event.id,
        creator: currUser.id,
        text: target.text.value,
        created_at: new Date(),
      }, config);
      console.log(response.data)
      getComments()
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
            <p>3-Day forecast for {event.location}</p>
            <div style={{display:"flex", flexDirection:"row"}}>

            {weatherData.map((item) => {
              return (
                <div style={{marginRight:"2em"}}>
                  <img src={item.day.condition.icon} />{format(new Date(item.date), "dd MMM")}
                  <h1>{item.day.avgtemp_c}°C</h1>
                  {item.day.maxtemp_c}°C - Max
                  <br/>
                  {item.day.mintemp_c}°C - Min
                </div>
              )
            })}
            </div>
          </div>
        )}
      </div>

      <hr />
      <DisplayActivity event={event}/>

      <h5 style={{paddingTop:"3em"}}>Comments</h5>

      <div className="grid-container">
        {comments.map((comment, i) => (
          <div key={i} className="grid-item">
            <div className="comment-box">
              <p className="comment-timestamp">Date created: {format(new Date(comment.created_at), "dd/MM/yyyy, p")}</p>
              <p>{comment.text}</p>
            </div>
            {comment.creator === currUser.id && (
              <Button size="sm" onClick={async() => {
                const response = await axios.delete(`https://eventify-n2c5.onrender.com/comment/${comment.id}`, config)
                console.log(response)
                getComments()
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
          <textarea className="comment-form" name="text" placeholder="Write comment"/>
          <br/>
          <Button size="sm" type="submit">Add Comment</Button>
        </form>
      </div>
    </>
  );
}