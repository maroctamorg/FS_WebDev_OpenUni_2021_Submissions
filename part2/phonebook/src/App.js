import React, { useState } from 'react'

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

const Person = ( {name, number} ) => <>{`${name} ${number}`}<br /></>

const Persons = (props) => (
  <div>
    {props.persons.map( person => <Person key={person.name} name={person.name} number={person.number}/>)}
  </div>
)

const App = () => {
  const [ persons, setPersons ] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ search, setNewSearch ] = useState('')

  const updateSearch = (event) => {
    console.log(event.target.value)
    setNewSearch(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault() // prevents default form behaviour which is to submit a post request
    console.log('button clicked', event.target)

    if ( persons.map( person => person.name ).includes(newName) ) {
      alert( `${newName} is already added to the phonebook` )

      return
    }

    const person = {
      name: newName,
      number: newNumber
    }

    setPersons(persons.concat(person))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const personsToShow = ( search ) => search === ''
    ? persons
    : persons.filter( person => person.name.toLowerCase() === search.toLowerCase())

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handler={updateSearch}/>
      <h3>add a new entry</h3>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons persons={personsToShow(search)} />
    </div>
  )
}

export default App