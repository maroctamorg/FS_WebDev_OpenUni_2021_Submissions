import React, { useEffect, useState } from 'react'
import phService from './services/phonebook'

const Notification = ({message, type}) => {
  console.log("Call to Notification")

  if(message === null || type === null) {
    console.log("Returning null, params: ", message, type)
    return null
  }

  return(
    <div className={type}>
      {message}
    </div>
  )
}

const Filter = (props) => <div>filter shown with <input value={props.search} onChange={props.handler}/></div>

const PersonForm = (props) => (
  <form onSubmit={props.addPerson}>
    <div>
      name: <input value={props.newName} onChange={props.handleNameChange}/>
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Person = ( {person, deleteEntry} ) => {
  
  return (
    <>
      {`${person.name} ${person.number}`} <button onClick={() => deleteEntry(person.id)}>delete</button> <br />
    </>
  )
}

const Persons = (props) => (
  <div>
    {props.persons.map( person => <Person key={person.id} person={person} deleteEntry={props.deleteEntry}/>)}
  </div>
)

const App = () => {
  const [ persons, setPersons ] = useState([])

  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ search, setNewSearch ] = useState('')

  const TYPE = {
    ERROR: "error",
    SUCCESS: "success"
  }
  const [ notification, setNotification ] = useState( {message: null, type: TYPE.ERROR})

  const updateNotification = (message, type) => {
    setNotification( {message: message, type: type} )
    setTimeout( () => { setNotification( {message: null, type: null} ) }, 5000)
  }

  useEffect( () => {
    phService
      .getAll()
      .then( phonebook => setPersons( phonebook ) )
      .catch( error => { updateNotification("Unable to fetch phonebook from the server. Please refresh the page and try again!", TYPE.ERROR) } ) 
  }, [])

  const addPerson = (event) => {
    event.preventDefault() // prevents default form behaviour which is to submit a post request

    const newPerson = {
      name: newName,
      number: newNumber
    }

    if ( persons.map( person => person.name ).includes(newPerson.name) ) {
      if ( persons.map( person => person.number).includes(newPerson.number) ){
        updateNotification(`The entry ${newName} ${newNumber} is already added to the phonebook`, TYPE.ERROR )
      } else {
        const confirmed = window.confirm(`Update phone number for entry '${newPerson.name} to ${newPerson.number}'?`)
        if (confirmed) {
          phService
          .update( persons.find( person => person.name === newPerson.name).id, newPerson )
          .then( returnedPerson => {
            setPersons(persons.map( person => person.name === newPerson.name ? returnedPerson : person ))
            setNewName('')
            setNewNumber('')
            updateNotification(`Successfully updated phone number for entry '${newPerson.name}' to '${newPerson.number}'!`, TYPE.SUCCESS)
          } )
          .catch( error => {
            updateNotification(`Error updating the number for the entry '${newPerson.name}' to the phonebook.
                                The entry was probably deleted from the server. Please refresh the page and try again!`, TYPE.ERROR)
          })
        }
      }
      
    } else {

      phService
        .create(newPerson)
        .then( returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          updateNotification(`Successfully created entry '${newPerson.name} ${newPerson.number}'!`, TYPE.SUCCESS)
        } )
        .catch( error => {
          updateNotification(`Error submitting the new entry: ${newPerson.name} ${newPerson.number} to the phonebook. Please try again!`, TYPE.ERROR)
        })
    }
  }

  const deleteEntry = (id) => {
    const personToDel = persons.find( person => person.id === id)
    const confirmed = window.confirm(`Delete entry ${personToDel.name} ${personToDel.number}?`)
    
    if(!confirmed) { 
      updateNotification(`the deletion of entry ${personToDel.name} ${personToDel.number} was cancelled`, TYPE.SUCCESS)
    } else {
      phService
      .deleteEntry(id)
      .then( response => {
          console.log(response)
          setPersons( persons.filter( person => person.id !== personToDel.id ) )
          updateNotification(`Successfully deleted entry ${personToDel.name} ${personToDel.number}`, TYPE.SUCCESS)
        }
      ).catch( error => {
          updateNotification(`Unable to delete entry ${personToDel.name} ${personToDel.number} from the server. Please try again!`, type.ERROR)
      })
    }
  }

  const personsToShow = ( search ) => search === ''
    ? persons
    : persons.filter( person => person.name.toLowerCase().includes( search.toLowerCase() ))


  const updateSearch = (event) => {
    setNewSearch(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <Notification message={notification.message} type={notification.type}/>
      <h2>Phonebook</h2>
      <Filter search={search} handler={updateSearch}/>
      <h3>add a new entry</h3>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons persons={personsToShow(search)} deleteEntry={deleteEntry}/>
    </div>
  )
}

export default App