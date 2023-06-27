import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, FloatingLabel, Col, Row } from 'react-bootstrap';
import AuthContext from "../context/AuthContext";
import axios from "axios";
import DatePicker from "react-datepicker";
import Select from 'react-select';
import { User } from "src/utils/Types";
import "/static/css/register.css";
import { AuthToken } from "src/utils/Types";


export default function EditEvent() {
  // Get event data from EventDesc.tsx/PageProfile.tsx and saves it as a const, to be used for default values
  const location = useLocation()
  const event = location.state.evt

  const [startDate, setStartDate] = useState(new Date(event.start));
  const [endDate, setEndDate] = useState(new Date(event.end));

  const [users, setUsers] = useState([])
  const [selectedOrganisers, setSelectedOrganisers] = useState([])
  const [selectedParticipants, setSelectedParticipants] = useState([])

  const { authTokens } = useContext(AuthContext) as { authTokens: AuthToken }

  // Headers for authorization @ backend => Allows request to django
  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

  useEffect(() => {
    getUsers();
  }, [])

  // End time/date for event >= start
  useEffect(() => {
    if (startDate > endDate) {
      setEndDate(startDate)
    }
  }, [startDate])

  // Start time/date for event <= end
  useEffect(() => {
    if (endDate < startDate) {
      setStartDate(endDate)
    }
  }, [endDate])

  const getUsers = async () => {
    const response = await axios.get('/api/users/', config)
    const data = response.data
    
    const hashmap = new Map<number, User>()
    // Map user.id to user object so they can be set to the organiser/participant field as default values
    data.forEach((user: User) => hashmap.set(user.id, user))
    setSelectedOrganisers(event.organizers.map((id: number) => hashmap.get(id)))
    setSelectedParticipants(event.participants.map((id: number) => hashmap.get(id)))
    setUsers(data)
    console.log(data)
  }

  // For redirect after form submit
  const navigate = useNavigate()

  // Update event
  const UpdateEventInfo = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const target = e.target as typeof e.target & {
        title: {value: string}
        description: {value: string}
        location: {value: string}
        budget: {value: number}
      }
      const response = await axios.put(`http://127.0.0.1:8000/events/${event.id}/`, {
        name: target.title.value,
        description: target.description.value,
        start: startDate.toJSON(),
        end: endDate.toJSON(),
        location: target.location.value,
        budget: target.budget.value,
        organizers: selectedOrganisers.map((organiser: User) => organiser.id),
        participants: selectedParticipants.map((participant: User) => participant.id)
      }, config);
      console.log(response.data)
      alert('Event updated successfully! THIS ALERT IS TEMPORARY FOR TESTING PURPOSES')
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="event-form">
      <h4>Edit Event</h4>
      <hr />
      <Form onSubmit={UpdateEventInfo}>
        <FloatingLabel controlId="floatingInput" label="Title">
          <Form.Control 
            className="event-form-field" 
            type="text" 
            name="title" 
            placeholder="Enter username" 
            defaultValue={event.name}
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
              selectsStart
              startDate={startDate}
              endDate={endDate}
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
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
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
            style={{ height: '120px'}} 
            name="description" 
            placeholder="Description" 
            defaultValue={event.description}
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
                defaultValue={event.location}
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
                defaultValue={event.budget}
                required
              />
            </FloatingLabel>
          </Col>
        </Row>
        <hr />
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
              required
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
        <hr />
        <Button variant="primary" type="submit">Update Event</Button>
      </Form>
    </div>
  )
}