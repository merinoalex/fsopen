import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

import Filter from './components/Filter'
import Form from './components/Form'
import List from './components/List'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setFilter] = useState('')
  const [notifMessage, setNotifMessage] = useState({status: null, message: null})

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }

    if (persons.find(p => p.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        const changedPerson = { ...person, number: newNumber }
        
        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
          })
          .then(() => {
            setNotifMessage(
              {
                status: 'success',
                message: `Updated ${newName} to ${newNumber}`
              }
            )
            setTimeout(() => {
              setNotifMessage({status: null, message: null})
            }, 5000);
          })
          .catch(error => {
            setNotifMessage(
              {
                status: 'error',
                message: `Information of ${newName} has already been removed from server`
              }
            )
            setTimeout(() => {
              setNotifMessage({status: null, message: null})
            }, 5000);
            console.error(error)
            setPersons(persons.filter(p => p.id !== changedPerson.id))
          })
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
        .then(() => {
          setNotifMessage(
            {
              status: 'success',
              message: `Added ${newName}`
            }
          )
          setTimeout(() => {
            setNotifMessage({status: null, message: null})
          }, 5000);
        })
    }
  }

  const deletePersonHandler = id => {
    const person = persons.find(p => p.id === id)

    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deleteEntry(person.id)
        .then(() => {
          personService
            .getAll()
            .then(newPersons => {
              setPersons(newPersons)
            })
        })
    }
  }

  const showPersons = newFilter
    ? persons.filter(f => 
      JSON.stringify(f.name).toLocaleLowerCase()
      .includes(newFilter.toLowerCase()))
    : persons

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification notifMessage={notifMessage} />
      <Filter 
        filter={newFilter} 
        filterHandler={handleFilterChange}
      />
      <h2>Add a new one</h2>
      <Form 
        submitHandler={addPerson}
        name={newName}
        nameHandler={handleNameChange}
        number={newNumber}
        numberHandler={handleNumberChange}
      />
      <h2>Numbers</h2>
      <List 
        show={showPersons} 
        deletePerson={deletePersonHandler}
      />
    </div>
  )
}

export default App