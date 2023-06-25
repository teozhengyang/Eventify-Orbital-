import { createContext, useState } from 'react';

const MonthContext = createContext({
  displayDate: new Date(),
  setDisplayDate: (index: Date) => {},
  displayType: "month",
  setDisplayType: (index: string) => {}
})

export default MonthContext;

export const MonthProvider = ({children}: {children: React.ReactNode}) => {
  const [displayDate, setDisplayDate] = useState(new Date());
  const [displayType, setDisplayType] = useState("month")
  return (
    <MonthContext.Provider value={{ displayDate, setDisplayDate, displayType, setDisplayType }}>
      {children}
    </MonthContext.Provider>
  )
}