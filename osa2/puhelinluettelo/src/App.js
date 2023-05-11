import { useEffect, useState } from 'react'
import Person from './components/Person'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Notification from './components/Notification'
import Error from './components/Error'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const person = {
      name: newName,
      number: newNumber
    }
    const duplicate = persons.find(person => person.name === newName)
    const index = persons.findIndex(person => person.name === newName)
    if (duplicate) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        // console.log('Koko: ', persons.filter(single_person => single_person.id !== duplicate.id).splice(index, 0, "testi"))
        // console.log('Testi: ', [1, 2, 3, 4].splice(2, 1, 10))
        // console.log('Index: ', index)
        personService
          .update(duplicate.id, person)
          .then(returnedPerson => {
            setPersons(persons.slice(0, index).concat(returnedPerson).concat(persons.slice(index + 1, persons.length)))
            setNewName('')
            setNewNumber('')
            setNotificationMessage(`Updated ${person.name}`)
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          })
          .catch(() => {
            setErrorMessage(`Information of ${person.name} has already been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
        }
    }
    else {
      personService
        .create(person)
        .then(returnedPerson => {
          // setNewName(newName)
          // setNewNumber(newNumber)
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotificationMessage(`Added ${person.name}`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(error => {
          // console.log(error.response.data.error)
          setErrorMessage(error.response.data.error)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const removePerson = (person) => {
    // debugger
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(single_person => single_person.id !== person.id))
          setNotificationMessage(`Deleted ${person.name}`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(() => {
          setErrorMessage(`Information of ${person.name} has already been removed from server`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

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
      <Notification message={notificationMessage} />
      <Error message={errorMessage} />
      <Filter filter={filter} onChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <div>
        {persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())).map(person =>
          <Person key={person.name} person={person} removePerson={removePerson} />
        )}
      </div>
    </div>
  )

}

export default App
