import React, { useEffect, useState } from 'react'
import phService from './services/phonebook'

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

  useEffect( () => {
    phService
      .getAll()
      .then( phonebook => setPersons( phonebook ) )
      .catch( error => { alert("Unable to fetch phonebook from the server. Please refresh the page and try again!") } ) 
  }, [])

  const addPerson = (event) => {
    event.preventDefault() // prevents default form behaviour which is to submit a post request

    const newPerson = {
      name: newName,
      number: newNumber
    }

    if ( persons.map( person => person.name ).includes(newPerson.name) ) {
      if ( persons.map( person => person.number).includes(newPerson.number) ){
        alert( `The entry ${newName} ${newNumber} is already added to the phonebook` )
      } else {
        const confirmed = window.confirm(`Update phone number for entry ${newPerson.name} to ${newPerson.number}?`)
        if (confirmed) {
          phService
          .update( persons.find( person => person.name === newPerson.name).id, newPerson )
          .then( returnedPerson => {
            setPersons(persons.map( person => person.name === newPerson.name ? returnedPerson : person ))
            setNewName('')
            setNewNumber('')
          } )
          .catch( error => {
            alert(`Error updating the number for the entry: ${newPerson.name} to the phonebook. Please try again!`)
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
        } )
        .catch( error => {
          alert(`Error submitting the new entry: ${newPerson.name} ${newPerson.number} to the phonebook. Please try again!`)
        })
    }
  }

  const deleteEntry = (id) => {
    const personToDel = persons.find( person => person.id === id)
    const confirmed = window.confirm(`Delete entry ${personToDel.name} ${personToDel.number}?`)
    
    if(!confirmed) { 
      console.log(`the deletion of entry ${personToDel.name} ${personToDel.number} was cancelled`)
    } else {
      phService
      .deleteEntry(id)
      .then( response => {
          console.log(response)
          setPersons( persons.filter( person => person.id !== personToDel.id ) )
        }
      ).catch( error => {
          alert(`Unable to delete entry ${personToDel.name} ${personToDel.number} from the server. Please try again!`)
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