import { createContext, useState } from 'react';
import { Event, emptyEvent, Activity, emptyActivity } from '../utils/Types';

const NewEventModalContext = createContext({
  showModal: false,
  setShowModal: (_input: boolean) => {},
  selectedDate: new Date(),
  setSelectedDate: (_input: Date) => {},
  selectedEvent: emptyEvent,
  setSelectedEvent: (_input: Event) => {},
  activityModal: false,
  setActivityModal: (_input: boolean) => {},
  selectedActivity: emptyActivity,
  setSelectedActivity: (_input: Activity) => {},
})

export default NewEventModalContext;

export const ModalProvider = ({children}: {children: React.ReactNode}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(emptyEvent);
  const [activityModal, setActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(emptyActivity)

  const contextData = {
    showModal,
    setShowModal,
    selectedDate,
    setSelectedDate,
    selectedEvent,
    setSelectedEvent,
    activityModal,
    setActivityModal,
    selectedActivity,
    setSelectedActivity,
  }

  return (
    <NewEventModalContext.Provider value={contextData}>
      {children}
    </NewEventModalContext.Provider>
  )
}