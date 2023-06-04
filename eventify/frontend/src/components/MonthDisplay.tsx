import Day from './Day';
import "/static/css/calendar.css";

export default function MonthDisplay({data, events}: {data: Array<Array<Date>>; events: Array<Event>}) {
  return (
    <div className="calendar-month" role="month view">
      {data.map((row: Array<Date>, i: number) => (
        <div key={i} className="calendar-week" role="week view">
          {row.map((day: Date, k: number) =>
            <Day 
              day={day}
              key={k}
              rowIndex={i} 
              events={events.filter((event) => {
                const curr = day.valueOf()
                const start = new Date(event.start).valueOf()
                const end = new Date(event.end).valueOf()
                return curr >= start && curr <= end
              })}/>
          )}
        </div>
      ))}
    </div>
  )
}