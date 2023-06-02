import { useState, useContext, useEffect } from "react";
import { getMonthMatrix } from "../utils/Calendar";
import MonthDisplay from "./MonthDisplay";
import CalendarHeader from "./CalendarHeader";
import NewEventModal from "./NewEventModal";
import MonthContext from "../context/MonthContext";

export default function Home() {
  const [monthData, setMonthData] = useState(getMonthMatrix());

  // Grabs a date from center of matrix, convert to string, split words by spaces (to get Month-Year header)
  const month = monthData[2][3].toString().split(" ");

  // Update MonthDisplay whenever calendar is swapped to another
  const { monthIndex } = useContext(MonthContext);
  useEffect(() => {
    setMonthData(getMonthMatrix(monthIndex));
  }, [monthIndex]);

  return (
    <div className="flex-container">
      <CalendarHeader month={month[1] + " " + month[3]}/>
      <NewEventModal />
      <MonthDisplay data={monthData} />
    </div>
  )
}