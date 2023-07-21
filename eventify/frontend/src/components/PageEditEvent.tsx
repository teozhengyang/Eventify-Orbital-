import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, FloatingLabel, Col, Row } from 'react-bootstrap';
import AuthContext from "../context/AuthContext";
import axios from "axios";
import DatePicker from "react-datepicker";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { User, AuthToken, Location, Option } from "../utils/Types";
import "/static/css/register.css";

export default function EditEvent() {
  // Get event data from EventDesc.tsx/PageProfile.tsx/DisplayActivity.tsx and saves it as a const, to be used for default values
  const location = useLocation()
  const event = location.state.evt
  const { authTokens } = useContext(AuthContext) as { authTokens: AuthToken }

  const [startDate, setStartDate] = useState(new Date(event.start));
  const [endDate, setEndDate] = useState(new Date(event.end));

  // User fields
  const [users, setUsers] = useState<Array<User>>([])
  const [selectedOrganisers, setSelectedOrganisers] = useState<Array<User>>([])
  const [selectedParticipants, setSelectedParticipants] = useState<Array<User>>([])

  // Category, Marketplace
  const [category, setCategory] = useState({value: event.category, label: event.category})
  const [isChecked, setIsChecked] = useState(event.shared)

  // Location
  const [, setInputLocation] = useState(event.location)
  const [selectedLocation, setSelectedLocation] = useState({value: "", label: "Search Location"})

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    console.log(isChecked)
  };

  const categoryOptions = [
    { value: 'Social', label: 'Social' },
    { value: 'Educational', label: 'Educational' },
    { value: 'Community', label: 'Community' },
    { value: 'Others', label: 'Others' },
  ];

  // Headers for authorization @ backend => Allows request to django
  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

  useEffect(() => {
    getUsers();
    getLocation();
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



  const API_KEY = '0c36bc53fdfe4278b3584452231107';
  const API_BASE_URL = 'https://api.weatherapi.com/v1';

  const formatLocationOption = (location: Location) => {
    const city = location.name ? location.name + ", " : ""
    const region = location.region ? location.region + ", " : ""
    const string = city + region + location.country
    return {value: string, label: string}
  }

  // Sets default value for event location
  const getLocation = async () => {
    const response = await axios.get(`${API_BASE_URL}/search.json`, {
      params: {
        key: API_KEY,
        q: event.location,
      },
    })
    setSelectedLocation(response.data.map(formatLocationOption))
  }

  // Handles search for during change to event location
  const searchLocation = (inputValue: string) => {
    return axios.get(`${API_BASE_URL}/search.json`, {
      params: {
        key: API_KEY,
        q: inputValue,
      },
    }).then((response) => {
      return response.data.map(formatLocationOption)
    }).catch((error) => {
      console.error('Error fetching possible locations:', error);
    });
  };

  const handleInputChange = (value:string) => {
    setInputLocation(value);
  };

  // Handle selection
  const handleLocationChange = (option:Option | null) => {
    if (option) {
      setSelectedLocation(option)
    }
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
      const response = await axios.put(`/api/events/${event.id}/`, {
        name: target.title.value,
        description: target.description.value,
        start: startDate.toJSON(),
        end: endDate.toJSON(),
        location: selectedLocation.value,
        budget: target.budget.value,
        organizers: selectedOrganisers.map((organiser: User) => organiser.id),
        participants: selectedParticipants.map((participant: User) => participant.id),
        category: category.value,
        shared: isChecked
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
          <Form.Label>Location:</Form.Label>
            <AsyncSelect 
              cacheOptions 
              defaultOptions 
              placeholder="Search Location"
              value={selectedLocation}
              loadOptions={searchLocation}
              onInputChange={handleInputChange}
              onChange={handleLocationChange}
            />
          </Col>
          <Col>
          <Form.Label>Budget:</Form.Label>
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
              getOptionValue={(option) => option.id.toString()}
              onChange={(data) => setSelectedOrganisers(Array.from(data))}
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
              getOptionValue={(option) => option.id.toString()}
              onChange={(data) => setSelectedParticipants(Array.from(data))}
              isSearchable={true}
              isMulti
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group as={Col}>
            <Form.Label>Select Category:</Form.Label>
            <Select
              options={categoryOptions}
              value={category}
              placeholder="Search category"
              onChange={(data) => setCategory(data)}
              isSearchable={true}
              required
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Add to marketplace:</Form.Label>
            <Form.Check 
              type="checkbox" 
              label="Share on marketplace" 
              defaultChecked={isChecked}
              onChange={handleCheckboxChange} />
          </Form.Group>
        </Row>

        <hr />
        <Button variant="primary" type="submit">Update Event</Button>
      </Form>
    </div>
  )
}