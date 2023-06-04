import { createContext, useState } from 'react';

const MonthContext = createContext({
  monthIndex: 0,
  setMonthIndex: (index: number) => {},
})

export default MonthContext;

export const MonthProvider = ({children}) => {
  const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
  return (
    <MonthContext.Provider value={{ monthIndex, setMonthIndex }}>
      {children}
    </MonthContext.Provider>
  )
}