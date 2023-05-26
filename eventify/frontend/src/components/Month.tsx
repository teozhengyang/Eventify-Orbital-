import Day from './Day';
import "/static/css/calendar.css";

export default function Month({month}) {
  return (
    
    <div className="flex-container">
      <h2>{month[0]}</h2>
      <div className="calendar-header" role="header">
        <div className="day-name">Sun</div>
        <div className="day-name">Mon</div>
        <div className="day-name">Tue</div>
        <div className="day-name">Wed</div>
        <div className="day-name">Thu</div>
        <div className="day-name">Fri</div>
        <div className="day-name">Sat</div>
      </div>
      <div className="calendar-month" role="month view">
        {month[1].map((row, i) => (
          <div key={i} className="calendar-week" role="week view">
            {row.map((day, index) =>
              <Day day={day} index={index} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}