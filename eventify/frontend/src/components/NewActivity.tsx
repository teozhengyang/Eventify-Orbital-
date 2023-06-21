import { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import NewEventModalContext from "../context/NewEventModalContext";
import axios from "axios";
import { Button, Form, FloatingLabel, Col, Row } from 'react-bootstrap';
import "/static/css/register.css";
import { subDays } from "date-fns";

//idk why got red line here, it seems to import and work just fine
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

// Might be nice to change the form to a bootstrap one
export default function NewActivity({event}: {event: Event}) {
  const eventStart = new Date(event.start)
  const eventEnd = new Date(event.end)

  const [startDate, setStartDate] = useState(eventStart)
  const [endDate, setEndDate] = useState(eventStart)
  const { authTokens, user } = useContext(AuthContext)
  const { setActivityModal } = useContext(NewEventModalContext)

  // Activity end date must be >= start date, activity start cannot precede event start
  useEffect(() => {
    if (startDate > endDate) {
      setEndDate(startDate)
    }
    if (startDate < eventStart) {
      setStartDate(eventStart)
    }
  }, [startDate])

  // Activity start date must be <= end date, activity end cannot go beyond event end
  useEffect(() => {
    if (endDate < startDate) {
      setStartDate(endDate)
    }
    if (endDate > eventEnd) {
      setEndDate(eventEnd)
    }
  }, [endDate])

  // Headers for authorization @ backend => Allows Get/Post request for activity data
  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

  const AddActivityInfo = async(e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://127.0.0.1:8000/activities/', {
        name: e.target.title.value,
        description: e.target.description.value,
        start: startDate.toJSON(),
        end: endDate.toJSON(),
        event: event.id,
        location: e.target.location.value,
        budget: e.target.budget.value,
      }, config);
      console.log(response.data)
      setActivityModal(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="event-form">
      <Form onSubmit={AddActivityInfo}>
        <FloatingLabel controlId="floatingInput" label="Title">
          <Form.Control 
            className="event-form-field" 
            type="text" 
            name="title" 
            placeholder="Enter title"
            required
          />
        </FloatingLabel> 
        <hr />
        <Row>
          <Form.Group as={Col}>
            <Form.Label>From</Form.Label>
            <DatePicker
              className="datepicker"
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              includeDateIntervals={[
                {start: subDays(eventStart, 1), end: eventEnd}
              ]}
              showTimeSelect
              timeCaption="Start time"
              timeIntervals={15}
              timeFormat="h:mm aa"
              dateFormat="dd MMMM yyyy - h:mm aa"
              required
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>To</Form.Label>
            <DatePicker
              className="datepicker"
              selected={endDate}
              onChange={(date: Date) => setEndDate(date)}
              includeDateIntervals={[
                {start: subDays(eventStart, 1), end: eventEnd}
              ]}
              showTimeSelect
              timeCaption="End time"
              timeIntervals={15}
              timeFormat="h:mm aa"
              dateFormat="dd MMMM yyyy - h:mm aa"
              required
            />
          </Form.Group>
        </Row>
        <hr />
        <FloatingLabel controlId="floatingInput" label="Description">
          <Form.Control 
            className="event-form-field" 
            as="textarea" 
            style={{ height: '120px' }} 
            name="description" 
            placeholder="Description"
          />
        </FloatingLabel>

        <Row>
          <Col>
            <FloatingLabel controlId="floatingInput" label="Location" style={{paddingTop: "5px"}}>
              <Form.Control 
                className="event-form-field" 
                type="text" 
                name="location" 
                placeholder="Location"
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel controlId="floatingInput" label="Budget" style={{paddingTop: "5px"}}>
              <Form.Control 
                className="event-form-field" 
                defaultValue={0}
                type="number" 
                name="budget" 
                min="0" 
                step="0.01" 
                placeholder="Budget"
                required
              />
            </FloatingLabel>
          </Col>
        </Row>
        <hr />
        <Button variant="primary" type="submit">Create Activity</Button>
      </Form>
    </div>
  )
}