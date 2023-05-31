import { useContext } from "react";
import MonthContext from "../context/MonthContext";

export default function CalendarHeader({month}: {month: string}) {

  const { monthIndex, setMonthIndex } = useContext(MonthContext)

  function present() {
    setMonthIndex(new Date().getMonth());
  }

  function prevMonth() {
    setMonthIndex(monthIndex - 1);
  }
  
  function nextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  return (
    <header className="calendar-header">
      <button onClick={present}>Today</button>
      <button onClick={prevMonth}>&lt;</button>
      <button onClick={nextMonth}>&gt;</button>
      <p>{month}</p>
    </header>
  )
}