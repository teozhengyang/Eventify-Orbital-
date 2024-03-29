import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalActivity from "./ModalActivity";
import AuthContext from "../context/AuthContext";
import NewEventModalContext from "../context/NewEventModalContext";
import axios from "axios";
import { Button } from "react-bootstrap";
import { addDays, subDays, format } from "date-fns";
import { Event, Activity, AuthUser, AuthToken } from "src/utils/Types";
import "/static/css/display.css";
import "/static/css/timetable.css";

// Temporary activity display until we either figure out timetable display or use an external one
export default function DisplayActivity({event}: {event: Event}) {
  const { activityModal, setActivityModal, setSelectedActivity } = useContext(NewEventModalContext)
  const { authTokens, user } = useContext(AuthContext) as { authTokens: AuthToken, user: AuthUser }

  const [activities, setActivities] = useState<Array<Activity>>([])
  // Current displayed date of timetable, set to 12AM
  const [currentDay, setCurrentDay] = useState<Date>(new Date(new Date(event.start).setHours(0, 0, 0, 0)))

  // Headers for authorization @ backend => Allows request to django
  const config = {
    headers:{'Authorization': 'Bearer ' + String(authTokens.access)},
    params:{'EventID': event.id},
  }

  // Update activity list when page first rendered or activity submitted via activity modal
  useEffect(() => {
    fetchActivity();
  }, [activityModal]);

  // setHours() mutate the Date object, so must create new Date object each time
  
  // NEED additional check for activities outside of the current event duration so that user can change the activity dates
  const isEqualDay = (date: string|number|Date) => {
    return currentDay.valueOf() == new Date(date).setHours(0, 0, 0, 0).valueOf()
  }

  const fetchActivity = async () => {
    try {
      const response = await axios.get('/api/activities/', config);
      console.log(response.data)
      setActivities(response.data)
    } catch (error) {
      console.error(error);
    }
  };

  const isOrganiser = event.organizers?.includes(user.user_id)

  const navigate = useNavigate()

  // Displays list for out of bounds activities for user to edit
  const outOfBoundsActivity = activities.filter((activity:Activity) => (new Date(activity.end) > new Date(event.end)) || (new Date(activity.start) < new Date(event.start)))
  const outOfBoundsTable = (
    <>
      <h4 style={{textAlign:"center"}}>The following Activities are outside the Event period</h4>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Start</th>
            <th>End</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {outOfBoundsActivity.map((activity:Activity, i) => (
            <tr key={i}>
              <td>{activity.name}</td>
              <td>{activity.description}</td>
              <td>{format(new Date(activity.start), "dd/MM/yyyy, p")}</td>
              <td>{format(new Date(activity.end), "dd/MM/yyyy, p")}</td>
              <td>
                <Button onClick={() => navigate('/EditActivity', {state:{act:activity, evt:event}})}>
                  Edit Activity
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )

  return (
    <div className="timetable">
      <ModalActivity event={event} defaultDate={currentDay}/>

      <header className="display-header">
        <Button disabled={!isOrganiser} onClick={() => {navigate('/EditEvent', {state:{evt:event}})}}>
          Edit Event
        </Button>

        <div id="display-title">
          <Button onClick={() => setCurrentDay(subDays(currentDay, 1))} disabled={isEqualDay(event.start)}>&lt;</Button>
          <h4 className="prevent-select" style={{width:"8em", textAlign:"center"}}>{currentDay.toDateString()}</h4>
          <Button onClick={() => setCurrentDay(addDays(currentDay, 1))} disabled={isEqualDay(event.end)}>&gt;</Button>
        </div>
        
        <Button disabled={!isOrganiser} onClick={() => setActivityModal(true)}>
          Add Activity
        </Button>
      </header>

      <div className="display-container">
        <ul className="timeslots">
          {Array.from(Array(24).keys()).map((hour) => {
            if (hour < 10) {
              return <li key={hour}>{"0" + hour + "00"}</li>
            } else {
              return <li key={hour}>{hour + "00"}</li>
            }
          })}
        </ul>
        <div className="activity-container" onClick={() => isOrganiser && setActivityModal(true)}>
            {activities.filter((activity:Activity) => {
                const curr = currentDay.valueOf()
                const start = new Date(activity.start).setHours(0, 0, 0, 0).valueOf()
                const end = new Date(activity.end).valueOf()
                // Filter events taking place in currentDay, includes events where start == end == 12AM
                return (curr >= start && curr < end) || (curr == start && curr == end)

              }).map((activity:Activity, i) => {
                const columnNo = (time:Date) => {
                  return time.getHours() * 4 + (time.getMinutes() / 15) + 1 
                }

                const start = new Date(activity.start)
                const end = new Date(activity.end)

                const leftBound = start.valueOf() < currentDay.valueOf()
                  ? 1
                  : columnNo(start)
                const rightBound = end.valueOf() >= addDays(currentDay, 1).valueOf()
                  ? 97
                  : columnNo(end)
                const colors = (new Date(activity.start) < new Date(event.start) || new Date(activity.end) > new Date(event.end)) 
                  ? "red"
                  : "green"

                const columnInfo = {
                  gridColumnStart: leftBound,
                  gridColumnEnd: rightBound,
                  backgroundColor: colors,
                }
                return (
                  <div key={i} className="activity-slot" style={columnInfo} onClick={() => setSelectedActivity(activity)}>
                    <p>{activity.name}</p>
                  </div>
                )
              })
            }
        </div>
      </div>

      <hr/>
      {((outOfBoundsActivity.length != 0) && isOrganiser) && outOfBoundsTable}

    </div>
  )
}