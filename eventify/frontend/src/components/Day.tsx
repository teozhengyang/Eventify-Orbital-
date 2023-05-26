import "/static/css/calendar.css";

export default function Day({day, index}) {
  return (
    <>
      <div className="calendar-day" key={index}>{day}</div>
    </>
  )
}