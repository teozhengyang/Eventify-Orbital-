import { useState, useEffect, useContext, useMemo } from 'react'
import AuthContext from '../context/AuthContext';
import axios from "axios";
import dayjs from 'dayjs';
import "/static/css/profile.css";
import { Button } from 'react-bootstrap';
import { useTable, usePagination } from 'react-table'

export default function Profile() {
  const { authTokens, user } = useContext(AuthContext);
  const [currUser, setCurrUser] = useState([])
  const [organisedEvents, setOrganisedEvents] = useState([])
  const [participatedEvents, setParticipatedEvents] = useState([])

  useEffect(() => {
    getCurrUser()
  },[])

  // Headers for authorization @ backend => Allows Get/Post request for event data
  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

  const getCurrUser = async () => {
    const userResponse = await axios.get(`http://127.0.0.1:8000/api/users/${user.user_id}`);
    const userData = userResponse.data
    console.log(userData)
    setCurrUser(userData)
    const eventsResponse = await axios.get('http://127.0.0.1:8000/events/', config)
    const eventsData = eventsResponse.data
    console.log(eventsData)

    const filterOrganiseEvents = eventsData.filter(event => {
      return event.organizers.includes(user.user_id)
    })
    setOrganisedEvents(filterOrganiseEvents)

    const filterParticipateEvents = eventsData.filter(event => {
      return event.participants.includes(user.user_id)
    })
    setParticipatedEvents(filterParticipateEvents)
  };

  const formatMoney = value => `$${value}`
  const formatTime = time => dayjs(time).format("DD/MM/YYYY HH:mm")

  const organisedEventsCOLUMNS  = [
    {
      Header: 'Select',
      Cell: ({value}) => (
        <div>
          <input type='checkbox' />
        </div>
      )
    },
    {
      Header: 'Name',
      accessor: 'name'
    },
    {
      Header: 'Description',
      accessor: 'description'
    },
    {
      Header: 'Location',
      accessor: 'location'
    },
    {
      Header: 'Budget',
      accessor: 'budget',
      Cell: ({ value }) => formatMoney(value),
    },
    {
      Header: 'Start',
      accessor: 'start',
      Cell: ({ time }) => formatTime(time),
    },
    {
      Header: 'End',
      accessor: 'end',
      Cell: ({ time }) => formatTime(time),
    },
    {
      Header: 'Actions',
      Cell: ({ value }) => (
        <div>
          <Button>Edit</Button>
          <Button>Delete</Button>
        </div>
      )
    }
  ]
  
  const organisedEventsColumns = useMemo(() => organisedEventsCOLUMNS, [])
  const organisedEventsData = useMemo(() => organisedEvents,[organisedEvents])

  const organisedTableInstance = useTable({
    columns: organisedEventsColumns, 
    data: organisedEventsData
  })

  const { 
    getTableProps: getOrganisedTableProps,
    getTableBodyProps: getOrganisedTableBodyProps,
    headerGroups: organisedHeaderGroups,
    rows: organisedRows,
    prepareRow: prepareOrganisedRow,
  } = organisedTableInstance

  const organisedEventDiv = (
    <div>
      <table {...getOrganisedTableProps()}>
        <thead>
          {
            organisedHeaderGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                  headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))
                }
              </tr>
            ))
          }
          <tr>
            <th></th>
          </tr>
        </thead>
        <tbody {...getOrganisedTableBodyProps()}>
          {organisedRows.map(row => {
            prepareOrganisedRow(row)
            return (
              <tr {...row.getRowProps()}>
                {
                  row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })
                }
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  

  const participatedEventsCOLUMNS  = [
    {
      Header: 'Select',
      Cell: ({value}) => (
        <div>
          <input type='checkbox' />
        </div>
      )
    },
    {
      Header: 'Name',
      accessor: 'name'
    },
    {
      Header: 'Description',
      accessor: 'description'
    },
    {
      Header: 'Location',
      accessor: 'location'
    },
    {
      Header: 'Budget',
      accessor: 'budget',
      Cell: ({ value }) => formatMoney(value),
    },
    {
      Header: 'Start',
      accessor: 'start',
      Cell: ({ time }) => formatTime(time),
    },
    {
      Header: 'End',
      accessor: 'end',
      Cell: ({ time }) => formatTime(time),
    },
    {
      Header: 'Actions',
      Cell: ({ value }) => (
        <div>
          <Button>View</Button>
        </div>
      )
    }
  ]

  const participatedEventsColumns = useMemo(() => participatedEventsCOLUMNS, [])
  const participatedEventsData = useMemo(() => participatedEvents,[participatedEvents])
  
  const participatedTableInstance = useTable({
    columns: participatedEventsColumns, 
    data: participatedEventsData
  })

  const { 
    getTableProps: getParticipatedTableProps,
    getTableBodyProps: getParticipatedTableBodyProps,
    headerGroups: participatedHeaderGroups,
    rows: participatedRows,
    prepareRow: prepareParticipatedRow,
  } = participatedTableInstance

  const participatedEventDiv = (
    <div>
      <table {...getParticipatedTableProps()}>
        <thead>
          {
            participatedHeaderGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                  headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))
                }
              </tr>
            ))
          }
          <tr>
            <th></th>
          </tr>
        </thead>
        <tbody {...getParticipatedTableBodyProps()}>
          {participatedRows.map(row => {
            prepareParticipatedRow(row)
            return (
              <tr {...row.getRowProps()}>
                {
                  row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })
                }
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  return (
    <div>
      <p>Name: {currUser.first_name} {currUser.last_name} | Email: {currUser.email}</p>
      <h4> Organised Events </h4>
      <hr />
      {organisedEvents && organisedEventDiv}
      <br/>
      <h4> Participated Events </h4>
      <hr/>
      {participatedEvents && participatedEventDiv}
    </div>
  )
}