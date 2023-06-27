import { useContext } from "react";
import NewEventModalContext from "../context/NewEventModalContext";
import { format } from "date-fns";
import AuthContext from "../context/AuthContext";
import { Event, User } from "src/utils/Types";
import "/static/css/calendar.css";

// day is a Date() object, convert to string and split by spaces to get individual string components
export default function Day({day, rowIndex, events}: {day: Date; rowIndex: number; events: Array<Event>;}) {
  const { setShowModal, setSelectedDate, setSelectedEvent } = useContext(NewEventModalContext)
  const { user } = useContext(AuthContext) as { user: User }

  // Open NewEventModal when a day is clicked
  const openModal = () => {
    setShowModal(true)
    setSelectedDate(day)
  }

  // Set css for blue circle on current day
  const sameDate = new Date().toDateString() === day.toDateString()

  const disp = (
    <div className="event-display">
    {events.map((evt, i) => {
      let className = "event-items"
      className += evt.organizers.includes(user.user_id) ? " organise" : " participate"
      return (
      <div className={className} key={i} onClick={() => setSelectedEvent(evt)}>
        <p>{evt.name}</p>
      </div>
    )})}
    </div>
  )

  return (
    <div className="calendar-day" onClick={openModal}>
    {rowIndex === 0 && format(day, 'E')}
      <header>
        <p id={sameDate ? "today" : "otherday"}>{day.getDate()}</p>
      </header>
      { events && disp }
    </div>
  )
}