import { useContext } from "react";
import NewEventModalContext from "../context/NewEventModalContext";

import "/static/css/calendar.css";

// day is a Date() object, convert to string and split by spaces to get individual string components
export default function Day({day, rowIndex}: {day: Date; key: number; rowIndex: number}) {
  const { setShowModal, setSelectedDate } = useContext(NewEventModalContext)

  const openModal = () => {
    setShowModal(true)
    setSelectedDate(day)
  }

  const sameDate = new Date().toDateString() === day.toDateString()

  return (
    <div className="calendar-day" onClick={openModal}>
      <header className="day-text">
        {rowIndex === 0 && (<>{day.toString().split(" ")[0]}</>)}
        <p id={sameDate ? "today" : "otherday"}>{day.getDate()}</p>
      </header>
    </div>
  )
}