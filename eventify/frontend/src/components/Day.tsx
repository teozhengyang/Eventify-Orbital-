import { useContext } from "react";
import NewEventModalContext from "../context/NewEventModalContext";

import "/static/css/calendar.css";

// day is the string representation of Date() object, split by spaces to get individual string components
export default function Day({day, rowIndex}: {day: Date; key: number; rowIndex: number}) {
  const { setShowModal, setSelectedDate } = useContext(NewEventModalContext)

  const click = () => {
    setShowModal(true)
    setSelectedDate(day)
  }

  return (
    <div className="calendar-day" onClick={click}>
      <header className="day-text">
        {rowIndex === 0 && (<>{day.toString().split(" ")[0]}</>)}
        <p>{day.getDate()}</p>
      </header>
    </div>
  )
}