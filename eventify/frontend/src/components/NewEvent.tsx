import { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import NewEventModalContext from "../context/NewEventModalContext";
import { Button, Form, FloatingLabel, Col, Row } from 'react-bootstrap';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";
import "/static/css/register.css";

//idk why got red line here, it seems to import and work just fine
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function NewEvent({defaultdate}: {defaultdate: Date}) {
  const [startDate, setStartDate] = useState(defaultdate)
  const [endDate, setEndDate] = useState(defaultdate)
  const { setShowModal } = useContext(NewEventModalContext)
  const { authTokens } = useContext(AuthContext)

  const [users, setUsers] = useState([])
  const [selectedOrganisers, setSelectedOrganisers] = useState([])
  const [selectedParticipants, setSelectedParticipants] = useState([])

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

  // Headers for authorization @ backend => Allows Get/Post request for event data
  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

  const getUsers = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/users/')
    const data = response.data
    setUsers(data)
    console.log(data)
  }

  const navigate = useNavigate()

  const AddEventInfo = async(e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://127.0.0.1:8000/events/', {
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
      setShowModal(false)
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="event-form">
      <Form onSubmit={AddEventInfo}>
        <FloatingLabel controlId="floatingInput" label="Title">
          <Form.Control 
            className="event-form-field" 
            type="text" 
            name="title" 
            placeholder="Enter username"
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

        <FloatingLabel controlId="floatingInput" label="Description" style={{paddingTop: "5px"}}>
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
              <Form.Control.Feedback type="invalid">
                Please input a budget.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>

        <Row>
          <Form.Group as={Col}>
            <Form.Label>Select Organisers:</Form.Label>
            <Select
              options={users}
              placeholder="Search organisers"
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
              placeholder="Search participants"
              getOptionLabel={(option) => option.username}
              getOptionValue={(option) => option.id}
              onChange={(data) => setSelectedParticipants(data)}
              isSearchable={true}
              isMulti
            />
          </Form.Group>
        </Row>

        <Button variant="primary" type="submit">Create Event</Button>
      </Form>
    </div>
  )
}