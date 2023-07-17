import { useContext } from 'react';
import NewEvent from './NewEvent';
import DescEvent from './DescEvent';
import NewEventModalContext from '../context/NewEventModalContext';
import AuthContext from '../context/AuthContext';
import { Modal }  from 'react-bootstrap';
import { emptyEvent, AuthUser } from '../utils/Types';
import "bootstrap/dist/css/bootstrap.min.css";
import "/static/css/modal.css";

export default function ModalEvent() {
  const { showModal, setShowModal, selectedDate, selectedEvent, setSelectedEvent } = useContext(NewEventModalContext);
  const { user } = useContext(AuthContext) as { user: AuthUser }

  const closeModal = () => {
    setShowModal(false)
    // Fixes visual where modal is seen to change display briefly due to modal closing animation time
    setTimeout(() => {
      setSelectedEvent(emptyEvent)
    }, 140)
  }
  
  const title = selectedEvent == emptyEvent
    ? <Modal.Title>New Event on {selectedDate.toString().slice(4, 10)}</Modal.Title>
    : <Modal.Title>{selectedEvent.name}</Modal.Title>

  const body = selectedEvent == emptyEvent
    ? <NewEvent defaultStart={selectedDate} defaultEnd={selectedDate} template={emptyEvent}/>
    : <DescEvent event={selectedEvent}/>

  const role = selectedEvent.organizers?.includes(user.user_id)
    ? "Organiser"
    : "Participant"

  return (
    <Modal dialogClassName="createevent" show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          {title}
        </Modal.Header>
        <Modal.Body>
          {body}
        </Modal.Body>
        <Modal.Footer style={{textAlign:"left"}}>
          {(selectedEvent != emptyEvent) && role}
        </Modal.Footer>
    </Modal>  
  );
}