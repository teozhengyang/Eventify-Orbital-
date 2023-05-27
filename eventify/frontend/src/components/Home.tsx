import { useState } from "react";
import { MonthCalendar } from "../Calendar";
import Month from "./Month";

export default function Home() {
  const [currMonth, setCurrMonth] = useState(MonthCalendar())
  
  return (
    <>
      <Month month={currMonth} />
    </>
  )
}