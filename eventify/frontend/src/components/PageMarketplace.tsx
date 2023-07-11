import { useState, useEffect, useContext } from "react"
import AuthContext from '../context/AuthContext';
import axios from "axios";
import { AuthToken, Event } from "../utils/Types";
import "/static/css/marketplace.css";
import { useNavigate } from "react-router-dom";

export default function Marketplace() {
  const { authTokens } = useContext(AuthContext) as { authTokens: AuthToken };
  const [eventList, setEventList] = useState([])      // The full list of user events

  const navigate = useNavigate()

  useEffect(() => {
    getEvents()
  },[])

  // Headers for authorization @ backend => Allows request to django
  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

  const getEvents = async () => {
    const eventsResponse = await axios.get('/api/events/', config)
    const events = eventsResponse.data
    const filteredEvents = events.filter((event:Event) => event.shared === true)
    setEventList(filteredEvents)
  };

  function filterCategory(category : String) {
    return eventList.filter((event:Event) => event.category === category).map((event:Event) => (
      <div className="item" onClick={() => {
        navigate(`/Event/${event.id}`, {state:{evt:event}})}}>
        <p><b>Name: {event.name}</b></p>
        <p>Location: {event.location}</p>
        <p>Budget: ${event.budget}</p>
      </div>
    ))
  }

  const eventDiv = (
    <>

      <div>
        <h6>Community</h6>
        <div className="grid">
          {filterCategory("Community")}
        </div>
      </div>

      <div>
        <h6>Educational</h6>
        <div className="grid">
          {filterCategory("Educational")}
        </div>
      </div>

      <div>
        <h6>Social</h6>
        <div className="grid">
          {filterCategory("Social")}
        </div>
      </div>

      <div>
        <h6>Others</h6>
        <div className="grid">
          {filterCategory("Others")}
        </div>
      </div>
      
    </>
  )

  return (
    <>
      <br />
      <h4>Templates</h4>
      <br />
      {eventList && eventDiv}
    </>
  )
}