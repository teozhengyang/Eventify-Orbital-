import { useContext } from "react";
import MonthContext from "../context/MonthContext";
import { ButtonGroup, Button } from "react-bootstrap";
import { addMonths, subMonths, addWeeks, subWeeks, format } from "date-fns";
import "/static/css/calendar.css";

export default function CalendarHeader() {
  const { displayDate, setDisplayDate, displayType, setDisplayType } = useContext(MonthContext)

  function present() {
    setDisplayDate(new Date());
  }

  function prev() {
    displayType === "month"
      ? setDisplayDate(subMonths(displayDate, 1))
      : setDisplayDate(subWeeks(displayDate, 1))
  }
  
  function next() {
    displayType === "month"
    ? setDisplayDate(addMonths(displayDate, 1))
    : setDisplayDate(addWeeks(displayDate, 1))
  }

  return (
    <header className="calendar-header">
      <Button variant="secondary" onClick={present}>Today</Button>
      <Button variant="secondary" onClick={prev}>&lt;</Button>
      <Button variant="secondary" onClick={next}>&gt;</Button>
      <p id="calendar-header-month">{format(displayDate, "MMM yyyy")}</p>
      <ButtonGroup>
        <Button variant="secondary" onClick={() => setDisplayType("week")}>Week</Button>
        <Button variant="secondary" onClick={() => setDisplayType("month")}>Month</Button>
      </ButtonGroup>
    </header>
  )
}