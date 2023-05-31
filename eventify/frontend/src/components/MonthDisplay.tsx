import Day from './Day';
import "/static/css/calendar.css";

export default function MonthDisplay({data}: {data: Array<Array<Date>>}) {
  return (
    <div className="calendar-month" role="month view">
      {data.map((row: Array<Date>, i: number) => (
        <div key={i} className="calendar-week" role="week view">
          {row.map((day: Date, k: number) =>
            <Day day={day} key={k} rowIndex={i} />
          )}
        </div>
      ))}
    </div>
  )
}