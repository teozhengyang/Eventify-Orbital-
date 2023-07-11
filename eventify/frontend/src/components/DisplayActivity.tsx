import { useContext, useState, useEffect } from "react";
import ModalActivity from "./ModalActivity";
import AuthContext from "../context/AuthContext";
import NewEventModalContext from "../context/NewEventModalContext";
import axios from "axios";
import { Button } from "react-bootstrap";
import { addDays, subDays } from "date-fns";
import { Event, Activity, AuthUser, AuthToken } from "src/utils/Types";
import "/static/css/display.css";
import "/static/css/timetable.css";

// Temporary activity display until we either figure out timetable display or use an external one
export default function DisplayActivity({event}: {event: Event}) {
  const { activityModal, setActivityModal, setSelectedActivity } = useContext(NewEventModalContext)
  const { authTokens, user } = useContext(AuthContext) as { authTokens: AuthToken, user: AuthUser }

  const [activities, setActivities] = useState<Array<Activity>>([])
  // Current displayed date of timetable, 12AM
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
  const nextDay = () => {
    if (currentDay.valueOf() < new Date(event.end).setHours(0, 0, 0, 0).valueOf()) {
      setCurrentDay(addDays(currentDay, 1))
    }
  }
  const prevDay = () => {
    if (currentDay.valueOf() > new Date(event.start).setHours(0, 0, 0, 0).valueOf()) {
      setCurrentDay(subDays(currentDay, 1))
    }
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

  function isOrganiser() {
    return event.organizers?.includes(user.user_id)
  }

  return (
    <div className="timetable">
      <ModalActivity event={event}/>

      <header className="display-header">
        <div id="display-title">
          <Button onClick={prevDay}>&lt;</Button>
          <h4 style={{width:"8em", textAlign:"center"}}>{currentDay.toDateString()}</h4>
          <Button onClick={nextDay}>&gt;</Button>
        </div>
        <Button disabled={!isOrganiser()} onClick={() => setActivityModal(true)}>
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

        <div className="activity-container" onClick={() => isOrganiser() && setActivityModal(true)}>
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
    </div>
  )
}