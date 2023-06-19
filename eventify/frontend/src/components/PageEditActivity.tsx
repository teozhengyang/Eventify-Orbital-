import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from "../context/AuthContext";
import { Button, Form, FloatingLabel, Col, Row } from 'react-bootstrap';
import { subDays } from "date-fns";
import axios from "axios";
import DatePicker from "react-datepicker";
import "/static/css/register.css";


export default function EditActivity() {
  // Get event/activity data from DisplayActivity.tsx and saves it as a const, to be used for default values
  const location = useLocation()
  const event = location.state.evt
  const activity = location.state.act

  const eventStart = new Date(event.start)
  const eventEnd = new Date(event.end)

  const [startDate, setStartDate] = useState(new Date(activity.start));
  const [endDate, setEndDate] = useState(new Date(activity.end));

  const { authTokens } = useContext(AuthContext)
  // Headers for authorization @ backend => Allows request to django
  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

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

  // For redirect to event page after submitting form
  const navigate = useNavigate()

  const UpdateActivityInfo = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://127.0.0.1:8000/activities/${activity.id}/`, {
        name: e.target.title.value,
        description: e.target.description.value,
        start: startDate.toJSON(),
        end: endDate.toJSON(),
        location: e.target.location.value,
        budget: e.target.budget.value,
      }, config);
      console.log(response.data)
      alert('Activity updated successfully!')
      navigate(`/Event/${event.id}`, {state:{evt:event}})
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="event-form">
      <Form onSubmit={UpdateActivityInfo}>
        <FloatingLabel controlId="floatingInput" label="Title">
          <Form.Control 
            className="event-form-field" 
            type="text" 
            name="title"
            defaultValue={activity.name}
            required
          />
        </FloatingLabel> 

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

        <FloatingLabel controlId="floatingInput" label="Description" style={{paddingTop: "5px"}}>
          <Form.Control 
            className="event-form-field" 
            as="textarea" 
            style={{ height: '120px' }} 
            name="description" 
            placeholder="Description"
            defaultValue={activity.description}
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
                defaultValue={activity.location}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel controlId="floatingInput" label="Budget" style={{paddingTop: "5px"}}>
              <Form.Control 
                className="event-form-field" 
                type="number" 
                name="budget" 
                min="0" 
                step="0.01" 
                placeholder="Budget"
                defaultValue={activity.budget}
                required
              />
            </FloatingLabel>
          </Col>
        </Row>


        <Button variant="primary" type="submit">Update Activity</Button>
      </Form>
    </div>
  )
}