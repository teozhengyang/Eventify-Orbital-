import { createContext, useState } from 'react';

const NewEventModalContext = createContext({
  showModal: false,
  setShowModal: (input: boolean) => {},
  selectedDate: new Date(),
  setSelectedDate: (input: Date) => {}
})

export default NewEventModalContext;

export const ModalProvider = ({children}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <NewEventModalContext.Provider value={{ showModal, setShowModal, selectedDate, setSelectedDate }}>
      {children}
    </NewEventModalContext.Provider>
  )
}