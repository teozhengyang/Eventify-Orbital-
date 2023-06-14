import { useContext, useState, useEffect, useRef } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { Button } from "react-bootstrap";
import { format, subDays, addDays } from "date-fns";

type Activity = {
  id?: number;
  name?: string;
  description?: string;
  start?: string;
  end?: string;
  location?: string;
  budget?: number;
}

type Event = {
  id?: number;
  start?: string;
  end?: string;
}

// Temporary activity display until we either figure out timetable display or use an external one
export default function DisplayActivity({event}: {event: Event}) {

  const { authTokens } = useContext(AuthContext)
  const [activities, setActivities] = useState([])

  // Headers for authorization @ backend => Allows request to django
  const config = {
    headers:{'Authorization': 'Bearer ' + String(authTokens.access)},
    params:{'EventID': event.id},
  }

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/activities/', config);
        console.log(response.data)
        setActivities(response.data)
      } catch (error) {
        console.error(error);
      }
    };
    fetchActivity();
  }, []);
  
  const activityDisplay = (
    <div>
      <table style={{border: 'solid'}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Start</th>
            <th>End</th>
            <th>Budget</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {activities.map((activity:Activity, i) => (
            <tr key={i}>
              <td>{activity.name}</td>
              <td>{activity.description}</td>
              <td>{format(new Date(activity.start), "dd/MM/yyyy, p")}</td>
              <td>{format(new Date(activity.end), "dd/MM/yyyy, p")}</td>
              <td>${activity.budget}</td>
              <td>
                <Button>
                  Edit
                </Button>
                <Button onClick={async() => {
                  const response = await axios.delete(`http://127.0.0.1:8000/activities/${activity.id}/`, {headers:{'Authorization': 'Bearer ' + String(authTokens.access)}})
                  console.log(response)
                }}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div style={{border: '1px solid'}}>
      <p style={{color: 'red'}}>Temporary activity display</p>
      {activities && activityDisplay}

      <div className="activity-container">
          <div className="date-header">
            if i can figure out the timetable thing maybe i can put it here if not rip
            Or we could try devexpress 
            
            *Add logic to edit/delete events if user is organiser
          </div>
          <div className="timeslots-container">
            <ul>
            </ul>
          </div>
      </div>
    </div>
  )
}