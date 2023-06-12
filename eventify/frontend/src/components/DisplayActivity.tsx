import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { Button } from "react-bootstrap";

type Event = {
  id?: number;
  name?: string;
  description?: string;
  start?: string;
  end?: string;
  location?: string;
  budget?: number;
  organizers?: Array<number>;
  participants?: Array<number>;
}


// Temporary activity display until we either figure out timetable display or use an external one
export default function DisplayActivity({event}: {event: Event}) {

  const { authTokens } = useContext(AuthContext)

  // Headers for authorization @ backend => Allows request to django
  const config = {
    headers:{'Authorization': 'Bearer ' + String(authTokens.access)},
    params:{'EventID': event.id},
  }

  const getActivities = async () => {
    const response = await axios.get('http://127.0.0.1:8000/activities/', config);
    const userData = response.data
    console.log(userData)
  };


  return (
    <div style={{border: '1px solid'}}>
      <p>Temporary activity display (check console)</p>
      <Button onClick={getActivities}>Get activities</Button>
    </div>
  )
}