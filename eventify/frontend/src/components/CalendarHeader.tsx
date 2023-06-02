import { useContext } from "react";
import MonthContext from "../context/MonthContext";
import "/static/css/calendar.css";
import { Dropdown, Button } from "react-bootstrap";

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
      <Button variant="secondary" onClick={present}>Today</Button>
      <Button variant="secondary" onClick={prevMonth}>&lt;</Button>
      <Button variant="secondary" onClick={nextMonth}>&gt;</Button>
      <p id="calendar-header-month">{month}</p>
      <Dropdown>
        <Dropdown.Toggle>View change WIP</Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item>Week</Dropdown.Item>
          <Dropdown.Item>Month</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </header>
  )
}