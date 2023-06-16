import { Modal }  from 'react-bootstrap';
import { useContext } from 'react';
import NewEventModalContext from '../context/NewEventModalContext';
import NewActivity from './NewActivity';
import "bootstrap/dist/css/bootstrap.min.css";

type Event = {
  id?: number;
  name?: string;
  description?: string;
  start?: string;
  end?: string;
  location?: string;
  budget?: number;
  organizers?: Array<number>;
  participants?: Array<number>;
}

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