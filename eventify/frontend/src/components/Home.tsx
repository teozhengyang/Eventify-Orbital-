import { useState, useContext, useEffect } from "react";
import { getMonthMatrix } from "../utils/Calendar";
import MonthDisplay from "./MonthDisplay";
import CalendarHeader from "./CalendarHeader";
import MonthContext from "../context/MonthContext";

export default function Home() {
  const [monthData, setMonthData] = useState(getMonthMatrix());

  // Grabs a date string from center of matrix, splits it by spaces (to display month year header, might modify)
  const month = monthData[2][3].split(" ");
  
  const { monthIndex } = useContext(MonthContext);

  useEffect(() => {
    setMonthData(getMonthMatrix(monthIndex));
  }, [monthIndex]);

  return (
    <div className="flex-container">
      <CalendarHeader month={month[1] + " " + month[3]}/>
      <MonthDisplay data={monthData} />
    </div>
  )
}