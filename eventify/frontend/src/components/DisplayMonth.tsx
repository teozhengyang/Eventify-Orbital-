import Day from "./Day";
import { Event } from "src/utils/Types";
import "/static/css/calendar.css";

export default function DisplayMonth({data, eventlist}: {data: Array<Array<Date>>; eventlist: Array<Event>}) {
  return (
    <div className="calendar-month" role="month view">
      {data.map((row: Array<Date>, i: number) => (
        <div key={i} className="calendar-week" role="week view">
          {row.map((day: Date, k: number) => {
            const filteredEvent = eventlist.filter((evt) => {
              const curr = day.valueOf();
              const start = new Date(evt.start).setHours(0, 0, 0, 0).valueOf();
              const end = new Date(evt.end).setHours(0, 0, 0, 0).valueOf();
              return curr >= start && curr <= end;
            })
            return (
              <Day
                day={day}
                key={k}
                rowIndex={i}
                events={filteredEvent}
              />
          )})}
        </div>
      ))}
    </div>
  );
}
