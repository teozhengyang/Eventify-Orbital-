import { createContext, useState } from 'react';

const NewEventModalContext = createContext({
  showModal: false,
  setShowModal: (input: boolean) => {},
  selectedDate: new Date(),
  setSelectedDate: (input: Date) => {},
  selectedEvent: null,
  setSelectedEvent: (input: Object) => {}
})

export default NewEventModalContext;

export const ModalProvider = ({children}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <NewEventModalContext.Provider value={{ showModal, setShowModal, selectedDate, setSelectedDate, selectedEvent, setSelectedEvent }}>
      {children}
    </NewEventModalContext.Provider>
  )
}