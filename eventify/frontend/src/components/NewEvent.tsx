import { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import NewEventModalContext from "../context/NewEventModalContext";
import { Button, Form, FloatingLabel, Col, Row } from 'react-bootstrap';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { useNavigate } from "react-router-dom";
import { User, AuthToken, Event, Location, Option } from "../utils/Types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "/static/css/register.css";

export default function NewEvent({defaultStart, defaultEnd, template}: {defaultStart: Date; defaultEnd: Date; template: Event}) {
  const [startDate, setStartDate] = useState(defaultStart)
  const [endDate, setEndDate] = useState(defaultEnd)
  const { setShowModal } = useContext(NewEventModalContext)
  const { authTokens } = useContext(AuthContext) as { authTokens: AuthToken }

  // User fields
  const [users, setUsers] = useState<Array<User>>([])
  const [selectedOrganisers, setSelectedOrganisers] = useState<Array<User>>([])
  const [selectedParticipants, setSelectedParticipants] = useState<Array<User>>([])

  // Category, Marketplace
  const [category, setCategory] = useState<Option>({value: "", label: ""})
  const [isChecked, setIsChecked] = useState(false);

  // Location
  const [, setInputLocation] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<Option>({value: "", label: "Search Location"})

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

  // Get all users
  useEffect(() => {
    getUsers()

    // Set location field if there is marketplace template
    if (template.location != "") {
      getLocation()
    }
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
    const response = await axios.get('https://eventify-n2c5.onrender.com/users/', config)
    const data = response.data
    setUsers(data)
  }

  const navigate = useNavigate()

  const AddEventInfo = async(e: React.FormEvent<HTMLFormElement>) => {
    console.log(isChecked)
    console.log(category)
    e.preventDefault()
    try {
      const target = e.target as typeof e.target & {
        title: {value: string}
        description: {value: string}
        location: {value: string}
        budget: {value: number}
      }
      const response = await axios.post('https://eventify-n2c5.onrender.com/events/', {
        name: target.title.value,
        description: target.description.value,
        start: startDate.toJSON(),
        end: endDate.toJSON(),
        location: selectedLocation.value,
        budget: target.budget.value,
        organizers: selectedOrganisers.map((org:User) => org.id),
        participants: selectedParticipants.map((par:User) => par.id),
        category: category.value,
        shared: isChecked
      }, config);
      console.log(response.data)
      setShowModal(false)
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }
  


  const API_KEY = '0c36bc53fdfe4278b3584452231107';
  const API_BASE_URL = 'https://api.weatherapi.com/v1';

  const formatLocationOption = (location: Location) => {
    const city = location.name ? location.name + ", " : ""
    const region = location.region ? location.region + ", " : ""
    const string = city + region + location.country
    return {value: string, label: string}
  }

  // Sets event location if there is marketplace template
  const getLocation = async () => {
    const response = await axios.get(`${API_BASE_URL}/search.json`, {
      params: {
        key: API_KEY,
        q: template.location,
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

  // handle location selection
  const handleLocationChange = (option: Option | null) => {
    if (option) {
      setSelectedLocation(option)
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
            placeholder="Enter title"
            defaultValue={template.name}
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
            style={{ height: '120px' }} 
            name="description"
            defaultValue={template.description}
            placeholder="Description"
          />
        </FloatingLabel>

        <Row>
          <Col>
            <Form.Label>Location:</Form.Label>
            <AsyncSelect 
              cacheOptions 
              defaultOptions 
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
                defaultValue={template.budget} 
                type="number" 
                name="budget" 
                min="0" 
                step="0.01" 
                placeholder="Budget"
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
              placeholder="Search category"
              onChange={(data) => {if (data) {setCategory(data)}}}
              isSearchable={true}
              required
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Add to marketplace:</Form.Label>
            <Form.Check 
              type="checkbox" 
              label="Share on marketplace" 
              onChange={handleCheckboxChange} />
          </Form.Group>
        </Row>
        
        <hr />
        <Button variant="primary" type="submit">Create Event</Button>
      </Form>
    </div>
  )
}