import Day from "./Day";
import "/static/css/calendar.css";

export default function MonthDisplay({data, eventlist,}: {data: Array<Array<Date>>; eventlist: Array<Object>;}) {
  return (
    <div className="calendar-month" role="month view">
      {data.map((row: Array<Date>, i: number) => (
        <div key={i} className="calendar-week" role="week view">
          {row.map((day: Date, k: number) => (
            <Day
              day={day}
              key={k}
              rowIndex={i}
              events={eventlist.filter((evt) => {
                const curr = day.valueOf();
                const start = new Date(evt.start).valueOf();
                const end = new Date(evt.end).valueOf();
                return curr >= start && curr <= end;
              })}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
