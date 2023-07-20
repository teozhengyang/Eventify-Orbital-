import { Modal }  from 'react-bootstrap';
import { useContext } from 'react';
import NewEventModalContext from '../context/NewEventModalContext';
import NewActivity from './NewActivity';
import DescActivity from './DescActivity';
import { Event, emptyActivity } from '../utils/Types';
import "bootstrap/dist/css/bootstrap.min.css";


export default function ModalActivity({event, defaultDate}:{event:Event, defaultDate:Date}) {
  const { activityModal, setActivityModal, selectedActivity, setSelectedActivity } = useContext(NewEventModalContext)
  
  const closeModal = () => {
    setActivityModal(false)
    // Fixes visual where modal is seen to change display briefly due to modal closing animation time
    setTimeout(() => {
      setSelectedActivity(emptyActivity)
    }, 140)
  }
  
  const title = selectedActivity == emptyActivity
  ? <Modal.Title>New Activity</Modal.Title>
  : <Modal.Title>{selectedActivity.name}</Modal.Title>

  const body = selectedActivity == emptyActivity
    ? <NewActivity event={event} defaultDate={defaultDate}/>
    : <DescActivity activity={selectedActivity} event={event}/>

  return (
    <Modal dialogClassName="createevent" show={activityModal} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {body}
      </Modal.Body>
      <Modal.Footer>
      </Modal.Footer>
    </Modal>  
  )
}