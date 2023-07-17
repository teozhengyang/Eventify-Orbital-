import { useContext } from "react";
import MonthContext from "../context/MonthContext";
import { ButtonGroup, Button } from "react-bootstrap";
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, format } from "date-fns";
import "/static/css/calendar.css";

export default function CalendarHeader() {
  const { displayDate, setDisplayDate, displayType, setDisplayType } = useContext(MonthContext)

  function present() {
    setDisplayDate(new Date());
  }

  function prev() {
    switch(displayType) {
      case "day":
        setDisplayDate(subDays(displayDate, 1))
        break
      case "week":
        setDisplayDate(subWeeks(displayDate, 1))
        break
      case "month":
        setDisplayDate(subMonths(displayDate, 1))
        break
    }
  }
  
  function next() {
    switch(displayType) {
      case "day":
        setDisplayDate(addDays(displayDate, 1))
        break
      case "week":
        setDisplayDate(addWeeks(displayDate, 1))
        break
      case "month":
        setDisplayDate(addMonths(displayDate, 1))
        break
    }
  }

  const headingFormat = (displayType == "day")
    ? "dd MMM yyyy"
    : "MMM yyyy"

  return (
    <header className="calendar-header">
      <Button variant="secondary" onClick={present}>Today</Button>
      <Button variant="secondary" onClick={prev}>&lt;</Button>
      <Button variant="secondary" onClick={next}>&gt;</Button>
      <p className="prevent-select" id="calendar-header-month">{format(displayDate, headingFormat)}</p>
      <ButtonGroup>
        <Button variant="secondary" onClick={() => setDisplayType("day")}>Day</Button>
        <Button variant="secondary" onClick={() => setDisplayType("week")}>Week</Button>
        <Button variant="secondary" onClick={() => setDisplayType("month")}>Month</Button>
      </ButtonGroup>
    </header>
  )
}