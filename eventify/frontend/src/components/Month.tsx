import Day from './Day';
import "/static/css/calendar.css";

export default function Month({data}: {data: Array<Array<string>>}) {
  return (
    <div className="calendar-month" role="month view">
      {data.map((row: Array<string>, i: number) => (
        <div key={i} className="calendar-week" role="week view">
          {row.map((day: string, k: number) =>
            <Day day={day} key={k} rowIndex={i} />
          )}
        </div>
      ))}
    </div>
  )
}