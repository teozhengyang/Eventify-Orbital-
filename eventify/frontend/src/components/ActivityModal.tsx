import { Modal }  from 'react-bootstrap';
import { useContext } from 'react';
import NewEventModalContext from '../context/NewEventModalContext';
import NewActivity from './NewActivity';
import { Event } from 'src/utils/Types';
import "bootstrap/dist/css/bootstrap.min.css";


export default function ActivityModal({event}:{event:Event}) {
  const { activityModal, setActivityModal } = useContext(NewEventModalContext)
  return (
    <Modal dialogClassName="createevent" show={activityModal} onHide={() => setActivityModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>New Activity</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <NewActivity event={event}/>
      </Modal.Body>
      <Modal.Footer>
      </Modal.Footer>
    </Modal>  
  )
}