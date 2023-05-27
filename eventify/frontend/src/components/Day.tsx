import "/static/css/calendar.css";

export default function Day({day, index}: {day: string; index: string}) {
  return (
    <>
      <div className="calendar-day" key={index}>{day}</div>
    </>
  )
}