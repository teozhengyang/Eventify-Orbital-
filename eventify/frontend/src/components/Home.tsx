import { useState, useContext, useEffect } from "react";
import { MonthCalendar } from "../utils/Calendar";
import Month from "./Month";
import CalendarHeader from "./CalendarHeader";
import { MonthContext } from "../context/MonthContext";


export default function Home() {
  const [monthData, setMonthData] = useState(MonthCalendar());

  // Grabs a date string from center of matrix, splits it by spaces (to display month year header, might modify)
  const month = monthData[2][3].split(" ");
  
  const { monthIndex } = useContext(MonthContext);

  useEffect(() => {
    setMonthData(MonthCalendar(monthIndex));
  }, [monthIndex]);

  return (
    <div className="flex-container">
      <CalendarHeader month={month[1] + " " + month[3]}/>
      <Month data={monthData} />
    </div>
  )
}