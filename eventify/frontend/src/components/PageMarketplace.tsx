import { useState, useEffect, useContext } from "react"
import AuthContext from '../context/AuthContext';
import axios from "axios";
import { AuthToken, Event } from "../utils/Types";
import "/static/css/marketplace.css";

export default function Marketplace() {
  const { authTokens } = useContext(AuthContext) as { authTokens: AuthToken };
  const [eventList, setEventList] = useState([])      // The full list of user events

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

  const eventDiv = (
    <div>

      <div>
        <h6>Community</h6>
        <div className="grid">
          {eventList.filter((event:Event) => event.category === 'Community').map((event:Event) => (
            <a href="/">
              <div className="item">
                <p><b>Name: {event.name}</b></p>
                <p>Location: {event.location}</p>
                <p>Budget: ${event.budget}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div>
        <h6>Educational</h6>
        <div className="grid">
          {eventList.filter((event:Event) => event.category === 'Educational').map((event:Event) => (
            <a href="/">
              <div className="item">
                <p><b>Name: {event.name}</b></p>
                <p>Location: {event.location}</p>
                <p>Budget: ${event.budget}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div>
        <h6>Social</h6>
        <div className="grid">
          {eventList.filter((event:Event) => event.category === 'Social').map((event:Event) => (
            <a href="/">
              <div className="item">
                <p><b>Name: {event.name}</b></p>
                <p>Location: {event.location}</p>
                <p>Budget: ${event.budget}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div>
        <h6>Others</h6>
        <div className="grid">
          {eventList.filter((event:Event) => event.category === 'Others').map((event:Event) => (
            <a href="/">
              <div className="item">
                <p><b>Name: {event.name}</b></p>
                <p>Location: {event.location}</p>
                <p>Budget: ${event.budget}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
      
    </div>
  )

  return (
    <div>
      <br />
      <h4>Marketplace</h4>
      <br />
      {eventList && eventDiv}
    </div>
  )
}