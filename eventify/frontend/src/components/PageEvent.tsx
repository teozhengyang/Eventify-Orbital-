import { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import AuthContext from '../context/AuthContext';
import DisplayActivity from "./DisplayActivity";


type Event = {
  id?: number;
}

export default function Event() {
  const location = useLocation();
  const [event, setEvent] = useState(location.state.evt);
  const { authTokens, user } = useContext(AuthContext);

  const config = {
    headers:{'Authorization': 'Bearer ' + String(authTokens.access)},
    params:{'EventID': event.id},
  }

  return (
    <div>
      <h2>Name: {event.name}</h2>
      <p>Description: {event.description}</p>
      <br></br>
      <DisplayActivity event={event}/>
    </div>
  );
}