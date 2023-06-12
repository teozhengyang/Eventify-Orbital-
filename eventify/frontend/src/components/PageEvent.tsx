import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from '../context/AuthContext';
import DisplayActivity from "./DisplayActivity";

export default function Event() {
  const [event, setEvent] = useState({});
  const { authTokens, user } = useContext(AuthContext);

  const { id } = useParams()

  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/events/${id}/`, config);
        setEvent(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvent();
  }, [id]);

  return (
    <div>
      <h2>Name: {event.name}</h2>
      <p>Description: {event.description}</p>
      <DisplayActivity event={event}/>
      <p>Potentially use an external timetable/schedule display component to show activities of event instead of above box</p>
      <p>If organiser, add buttons to edit/delete event</p>
    </div>
  );
}