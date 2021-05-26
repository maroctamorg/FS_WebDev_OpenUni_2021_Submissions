import React, {useState} from 'react'

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

const Statistic = ({text, value}) => <tr><td>{text}</td><td>{value}</td></tr>

const Statistics = ({goodFb, neutralFb, badFb}) => {

  const sum = goodFb + neutralFb + badFb

  if(sum == 0) {
    return (
      <div>
        <h1>statistics</h1>
        <div>No feedback given</div>
      </div>
    )
  }
  return (
    <div>
      <h1>statistics</h1>
      <div>
        <table>
          <tbody>
            <Statistic text={ 'good' } value={ goodFb } />
            <Statistic text={ 'neutral' } value={ neutralFb } />
            <Statistic text={ 'bad' } value={ badFb } />
            <Statistic text={ 'all' } value={ sum } />
            <Statistic text={ 'average' } value={ goodFb - badFb } />
            <Statistic text={ 'positive' } value={ 100 * goodFb / sum + ' %'} />
          </tbody>
        </table>
      </div>
    </div>
  )
}

const App = () => {

  const [goodFb, setGoodFb] = useState(0)
  const [neutralFb, setNeutralFb] = useState(0)
  const [badFb, setBadFb] = useState(0)

  const handler = (feedback) => {
    if(feedback == 'good') {
      return( () => setGoodFb(goodFb + 1) )
    } else if (feedback == 'neutral') {
      return( () => setNeutralFb(neutralFb + 1) )
    } else if (feedback == 'bad') {
      return( () => setBadFb(badFb + 1) )
    } else {
      console.log("Invalid button handleClick parameter called!")
      return null
    }
  }

  return (
    <div>
      <h1>give feedback</h1>

      <Button handleClick={handler('good')}     text='good'     />
      <Button handleClick={handler('neutral')}  text='neutral'  />
      <Button handleClick={handler('bad')}      text='bad'      />

      <Statistics goodFb={goodFb} neutralFb={neutralFb} badFb={badFb} />

    </div>
  )
}

export default App;
