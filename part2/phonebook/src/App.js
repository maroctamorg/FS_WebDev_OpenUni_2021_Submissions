import React, { useState } from 'react'

const Filter = (props) => {

}

const Persons = (props) => (
  <div>
    <h2>Numbers</h2>
    {props.persons.map( person => <div key={person.name}>{`${person.name} ${person.number}`}</div>)}
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
      <div>
        filter shown with <input value={search} onChange={updateSearch}/>
      </div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <Persons persons={personsToShow(search)} />
    </div>
  )
}

export default App