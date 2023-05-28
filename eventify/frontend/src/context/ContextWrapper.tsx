import { useState } from 'react'
import { MonthContext } from './MonthContext'

export default function ContextWrap(props) {
  const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
  return (
    <MonthContext.Provider value={{ monthIndex, setMonthIndex }}>
      {props.children}
    </MonthContext.Provider>
  )
}