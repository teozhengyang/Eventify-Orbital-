import Day from "./Day";
import { Event } from "src/utils/Types";
import "/static/css/calendar.css";


// Temporary week view until we can figure out how to make a timetable style display
export default function DisplayWeek({data, eventlist}: {data: Array<Date>; eventlist: Array<Event>;}) {
  return (
    <div className="week-display" role="week view">
      {data.map((day: Date, k: number) => (
        <Day
          day={day}
          key={k}
          rowIndex={0}
          events={eventlist.filter((evt) => {
            const curr = day.valueOf();
            const start = new Date(evt.start).setHours(0, 0, 0, 0).valueOf();
            const end = new Date(evt.end).setHours(0, 0, 0, 0).valueOf();
            return curr >= start && curr <= end;
          })}
        />
      ))}
    </div>
  );
}
