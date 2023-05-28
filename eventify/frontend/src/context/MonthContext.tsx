import { createContext } from 'react';

export const MonthContext = createContext({
  monthIndex: 0,
  setMonthIndex: (index: number) => {}
})