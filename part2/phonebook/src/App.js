import { useState, useEffect } from 'react'
import personService from './services/persons'

import Filter from './components/Filter'
import Form from './components/Form'
import List from './components/List'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setFilter] = useState('')

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

    if (JSON.stringify(persons).includes(newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        const changedPerson = { ...person, number: newNumber }
        
        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
          })
          .catch(error => console.error(error))
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
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
      <h2>Phonebook</h2>
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