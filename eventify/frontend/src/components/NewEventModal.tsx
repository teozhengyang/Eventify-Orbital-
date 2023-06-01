import { useContext } from 'react';
import NewEvent from './NewEvent';
import NewEventModalContext from '../context/NewEventModalContext';
import { Modal }  from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "/static/css/modal.css";

export default function NewEventModal() {
  const { showModal, setShowModal, selectedDate } = useContext(NewEventModalContext); 
  return (
    <Modal dialogClassName="createevent" show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Event on {selectedDate.toString().slice(4, 10)}</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <NewEvent defaultdate={selectedDate}/>
        </Modal.Body>

        <Modal.Footer>
        </Modal.Footer>
    </Modal>
  );
}