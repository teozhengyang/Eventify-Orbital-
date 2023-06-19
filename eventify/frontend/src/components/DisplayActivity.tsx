import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ActivityModal from "./ActivityModal";
import AuthContext from "../context/AuthContext";
import NewEventModalContext from "../context/NewEventModalContext";
import axios from "axios";
import { Button, ButtonGroup } from "react-bootstrap";
import { format, differenceInMinutes } from "date-fns";
import "/static/css/timetable.css";

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
  organizers?: Array<number>;
}

// Temporary activity display until we either figure out timetable display or use an external one
export default function DisplayActivity({event}: {event: Event}) {
  const { activityModal, setActivityModal } = useContext(NewEventModalContext)
  const { authTokens, user } = useContext(AuthContext)
  const [activities, setActivities] = useState([])

  // Headers for authorization @ backend => Allows request to django
  const config = {
    headers:{'Authorization': 'Bearer ' + String(authTokens.access)},
    params:{'EventID': event.id},
  }

  // Update activity list when page first rendered or activity submitted via activity modal
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
  }, [activityModal]);

  // For edit button function
  const navigate = useNavigate()

  // Disable edit/delete options for activity if not an organiser
  const isOrganiser = event.organizers?.includes(user.user_id)

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
                <ButtonGroup>
                  <Button disabled={!isOrganiser} onClick={() => navigate('/EditActivity', {state:{act:activity, evt:event}})}>
                    Edit
                  </Button>
                  <Button disabled={!isOrganiser} onClick={async() => {
                    const response = await axios.delete(`http://127.0.0.1:8000/activities/${activity.id}/`, {headers:{'Authorization': 'Bearer ' + String(authTokens.access)}})
                    window.location.reload()
                    console.log(response)
                  }}>
                    Delete
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div style={{border: '1px solid', overflow: 'scroll'}}>
      <p style={{color: 'red'}}>Temporary activity display</p>
      <Button disabled={!isOrganiser} onClick={() => setActivityModal(true)}>Add Activity</Button>
      {activities && activityDisplay}
      <ActivityModal event={event}/>

      <br></br>
      <p>
        Everything from here on is a test
        if i can figure out the timetable thing maybe i can put it here if not will just use the above table as a display (with sorting functions?)
        Or we could try devexpress 
      </p>

      <div className="display-container">
          <ul className="timeslots">
            {Array.from(Array(24).keys()).map((hour) => {
              if (hour < 10) {
                return <li>{"0" + hour + "00"}</li>
              } else {
                return <li>{hour + "00"}</li>
              }
            })}
          </ul>
          <div className="activity-container">
              <div className="slot slot-1">
                <p>Hi</p>
              </div>
              <div className="slot slot-2">
                <p>Test</p>
              </div>
              {activities.map(activity => {
                const start = new Date(activity.start)
                const end = new Date(activity.end)
                const boxStyle = {
                  border: "1px solid",
                  gridRow: "1",
                  gridColumn: (start.getHours() * 4 + (start.getMinutes() / 15) + 1),
                  width: differenceInMinutes(end, start),
                }
                return (
                  <div className="slot" style={boxStyle}>
                    <p>{activity.name}</p>
                  </div>
                )
              })}
          </div>
      </div>
    </div>
  )
}