import "/static/css/calendar.css";

// day is the string representation of Date() object, split by spaces to get individual string components
export default function Day({day, rowIndex}: {day: string; key: number; rowIndex: number}) {
  return (
    <div className="calendar-day">
      <header className="day-text">
        {rowIndex === 0 && (<>{day.split(" ")[0]}</>)}
        <p>{day.split(" ")[2]}</p>
      </header>
    </div>
  )
}