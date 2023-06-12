import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, FloatingLabel, Col, Row } from 'react-bootstrap';
import AuthContext from "../context/AuthContext";
import axios from "axios";
import DatePicker from "react-datepicker";
import "/static/css/register.css";
import Select from 'react-select';
import NewActivity from "./NewActivity";

type user = {
  id?: number;
  username?: string;
}

export default function EditEvent() {
  // Get event data from EventDesc.tsx and saves it as a const, to be used for default values
  const location = useLocation()
  const event = location.state.evt

  const [startDate, setStartDate] = useState(new Date(event.start));
  const [endDate, setEndDate] = useState(new Date(event.end));

  const [users, setUsers] = useState([])
  const [selectedOrganisers, setSelectedOrganisers] = useState()
  const [selectedParticipants, setSelectedParticipants] = useState()

  const { authTokens } = useContext(AuthContext)

  // Headers for authorization @ backend => Allows request to django
  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

  useEffect(() => {
    getUsers();
  }, [])

  // Event end date must be >= start date
  useEffect(() => {
    if (startDate > endDate) {
      setEndDate(startDate)
    }
  }, [startDate])

  const getUsers = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/users/')
    const data = response.data
    let hashmap = new Map<number, user>()
    data.forEach((user) => hashmap.set(user.id, user))
    setSelectedOrganisers(event.organizers.map(id => hashmap.get(id)))
    setSelectedParticipants(event.participants.map(id => hashmap.get(id)))
    setUsers(data)
    console.log(data)
  }

 
  const navigate = useNavigate()

  // Update event
  const UpdateEventInfo = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://127.0.0.1:8000/events/${event.id}/`, {
        name: e.target.title.value,
        description: e.target.description.value,
        start: startDate.toJSON(),
        end: endDate.toJSON(),
        location: e.target.location.value,
        budget: e.target.budget.value,
        organizers: selectedOrganisers.map(organiser => organiser.id),
        participants: selectedParticipants.map(participant => participant.id)
      }, config);
      console.log(response.data)
      alert('Event updated successfully!')
      navigate('/')
    } catch (error) {
      console.error(error.response)
    }
  }

  return (
    <div className="event-form">
      <p>Edit Event (WIP)</p>
      <Form onSubmit={UpdateEventInfo}>
        <FloatingLabel controlId="floatingInput" label="Title">
          <Form.Control 
            className="event-form-field" 
            type="text" 
            name="title" 
            placeholder="Enter username" 
            defaultValue={event.name}
          />
        </FloatingLabel>

        <Row>
          <Form.Group as={Col}>
            <Form.Label>From</Form.Label>
            <DatePicker
              className="datepicker"
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              showTimeSelect
              timeCaption="Start time"
              timeIntervals={15}
              timeFormat="h:mm aa"
              dateFormat="dd MMMM yyyy - h:mm aa"
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>To</Form.Label>
            <DatePicker
              className="datepicker"
              selected={endDate}
              onChange={(date: Date) => setEndDate(date)}
              minDate={startDate}
              showTimeSelect
              timeCaption="End time"
              timeIntervals={15}
              timeFormat="h:mm aa"
              dateFormat="dd MMMM yyyy - h:mm aa"
            />
          </Form.Group>
        </Row>

        <FloatingLabel controlId="floatingInput" label="Description">
          <Form.Control 
            className="event-form-field" 
            as="textarea" 
            style={{ height: '120px' }} 
            name="description" 
            placeholder="Description" 
            defaultValue={event.description}
          />
        </FloatingLabel>

        <Row>
          <Col>
            <FloatingLabel controlId="floatingInput" label="Location">
              <Form.Control 
                className="event-form-field" 
                type="text" 
                name="location" 
                placeholder="Location" 
                defaultValue={event.location}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel controlId="floatingInput" label="Budget">
              <Form.Control 
                className="event-form-field" 
                type="number" 
                name="budget" 
                min="0" 
                step="0.01" 
                placeholder="Budget"
                defaultValue={event.budget}
              />
            </FloatingLabel>
          </Col>
        </Row>

        <Row>
          <Form.Group as={Col}>
            <Form.Label>Select Organisers:</Form.Label>
            <Select
              options={users}
              placeholder="Search organisers"
              value={selectedOrganisers}
              getOptionLabel={(option) => option.username}
              getOptionValue={(option) => option.id}
              onChange={(data) => setSelectedOrganisers(data)}
              isSearchable={true}
              isMulti
              />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Select Participants:</Form.Label>
            <Select
              options={users}
              value={selectedParticipants}
              placeholder="Search participants"
              getOptionLabel={(option) => option.username}
              getOptionValue={(option) => option.id}
              onChange={(data) => setSelectedParticipants(data)}
              isSearchable={true}
              isMulti
            />
          </Form.Group>
        </Row>
        <h3>Field inputs to change participants, or promote them to organiser somehow. Will need to implement organiser/participant for other components too</h3>
        <Button variant="primary" type="submit">Update Event</Button>
      </Form>
      <h2>Temp activity create form, not sure if we wanna keep it here, get activity button is at individual activity event page</h2>
      <NewActivity event={event}/>
    </div>
  )
}