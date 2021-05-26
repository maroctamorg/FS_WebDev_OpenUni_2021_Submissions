import React, { useState } from 'react'

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

const Popular = ({anecdotes}) => {
  let mostPopular = 0
  let max = 0
  let element
  for(element of anecdotes) {
    if(element.votes > max) {
      max = element.votes
      mostPopular = element
    }
  }

  if(max == 0) {
    return (
      <div>
        No anecdote has any votes at the moment.
      </div>
    )
  }

  return (
    <div>
      <h1>Anecdote with most votes</h1>
      {mostPopular.anecdote}<br />
      has {mostPopular.votes} votes
    </div>
  )
}

const App = () => {

  // I have chosen to implement the state as an array of objects for the sake of code versatility and modularity
  // I am aware that it would have been easier and more efficient to define separate arrays for the anecdotes and
  // their votes, but such a solution would not be as easily modified if for instance the developer would wish to
  // add more anecdotes (the developer would have to make sure to also update the votes array), or if the
  // functionality of adding anecdotes in realtime were to be implemented

  const anecdote_list = [
    {
      anecdote: 'If it hurts, do it more often',
      votes: 0,
    },
    {
      anecdote: 'Adding manpower to a late software project makes it later!',
      votes: 0,
    },
    {
      anecdote: 'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
      votes: 0,
    },
    {
      anecdote: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
      votes: 0,
    },
    {
      anecdote: 'Premature optimization is the root of all evil.',
      votes: 0,
    },
    {
      anecdote: 'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
      votes: 0,
    }
  ]

  const randomInt = (maxInt) => Math.floor(Math.random()*(maxInt))
   
  const [selected, setSelected] = useState(randomInt(anecdote_list.length-1))
  const [anecdotes, setVote] = useState(anecdote_list)

  const nextAnecdote = () => { setSelected(randomInt(anecdotes.length-1)) }

  const vote = (selected) => () => {
    console.log("Call to vote with selected value:", selected)
    const copy = [ ...anecdotes ]
    copy[selected].votes += 1
    setVote ( copy )
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected].anecdote}<br />
      has {anecdotes[selected].votes} votes<br />
      <Button handleClick={vote(selected)} text={'vote'} />
      <Button handleClick={nextAnecdote} text={'next anecdote'} />

      <Popular anecdotes={anecdotes} />
    </div>
  )
}

export default App