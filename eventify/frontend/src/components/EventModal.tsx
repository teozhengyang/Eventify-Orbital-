import { useContext } from 'react';
import NewEvent from './NewEvent';
import EventDesc from './EventDesc';
import NewEventModalContext from '../context/NewEventModalContext';
import { Modal }  from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "/static/css/modal.css";

export default function EventModal() {
  const { showModal, setShowModal, selectedDate, selectedEvent, setSelectedEvent } = useContext(NewEventModalContext);

  const closeModal = () => {
    setShowModal(false)
    setTimeout(() => {
      setSelectedEvent(null)
    }, 120)
  }

  const title = selectedEvent == null
    ? <Modal.Title>New Event on {selectedDate.toString().slice(4, 10)}</Modal.Title>
    : <Modal.Title>{selectedEvent.name}</Modal.Title>

  const body = selectedEvent == null
    ? <NewEvent defaultdate={selectedDate}/>
    : <EventDesc info={selectedEvent}/>

  return (
    <Modal dialogClassName="createevent" show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          {title}
        </Modal.Header>
        <Modal.Body>
          {body}
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
    </Modal>  
  );
}