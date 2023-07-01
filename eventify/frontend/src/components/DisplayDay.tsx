import { useContext } from "react";
import { Event, AuthUser } from "src/utils/Types";
import NewEventModalContext from "../context/NewEventModalContext";
import MonthContext from "../context/MonthContext";
import AuthContext from "../context/AuthContext";
import { addDays } from "date-fns";
import "/static/css/daydisplay.css";

export default function DisplayDay({eventlist}: {eventlist: Array<Event>}) {
  const { setShowModal, setSelectedEvent, setSelectedDate } = useContext(NewEventModalContext)
  const { displayDate } = useContext(MonthContext)
  const { user } = useContext(AuthContext) as { user:AuthUser }

  const startOfDay = new Date(displayDate.setHours(0, 0, 0, 0))

  const openModal = () => {
    setShowModal(true)
    setSelectedDate(displayDate)
  }

  return (
    <div className="day-display">
      <ul className="dayslots">
        {Array.from(Array(24).keys()).map((hour) => {
          if (hour < 10) {
            return <li key={hour}>{"0" + hour + "00"}</li>
          } else {
            return <li key={hour}>{hour + "00"}</li>
          }
        })}
      </ul>
      
      <div className="event-container" onClick={openModal}>
        {eventlist.filter((event: Event) => {
            const curr = startOfDay.valueOf()
            const start = new Date(event.start).setHours(0, 0, 0, 0).valueOf()
            const end = new Date(event.end).valueOf()
            return curr >= start && curr < end

          }).map((event: Event, i) => {
            const rowNo = (time:Date) => {
              return time.getHours() * 4 + (time.getMinutes() / 15) + 1 
            }

            const start = new Date(event.start)
            const end = new Date(event.end)

            const leftBound = start.valueOf() < startOfDay.valueOf()
              ? 1
              : rowNo(start)
            const rightBound = end.valueOf() >= addDays(startOfDay, 1).valueOf()
              ? 97
              : rowNo(end)
            const color = event.organizers.includes(user.user_id) ? "green" : "brown"

            const rowInfo = {
              gridRowStart: leftBound,
              gridRowEnd: rightBound,
              backgroundColor: color,
            }
            return (
              <div key={i} className="event-slot" style={rowInfo} onClick={() => setSelectedEvent(event)}>
                <p>{event.name}</p>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}