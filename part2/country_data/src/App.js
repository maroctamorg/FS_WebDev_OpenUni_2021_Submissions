import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Country = ( {country, state} ) => {
  console.log("Call to Country component")
  const [show, setShow] = useState(state)
  const [weather, setWeather] = useState({})

  const api_key = process.env.REACT_APP_WEATHER_API_KEY
  console.log(api_key)

  const updateWeatherData = () => {
    console.log("Call to updateWeatherData")
    if(api_key !== "1010") {
      console.log("Wrong api key")
      return
    }
    const cancelToken = axios.CancelToken
    const source = cancelToken.source()
    const url = `https://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}}`
    // const url = `http://localhost:3001/weatherData/${country.capital}` - used for testing
    axios
      .get( url, {
        cancelToken: source.token
      })
      .then( response => { 
        console.log("weather data response", response)
        setWeather( response.data )
      } )
      .catch( error => {
        console.log("failed to obtain weatherData from api")
        setWeather( {} )
      })

    return () => {
      source.cancel(`api request to ${url} was cancelled as the component unmounted`);
      };
  }

  useEffect( updateWeatherData, [] )

  if(!show) {
    return (
      <div>
        <>{country.name}</>
        <button onClick={ () => {setShow(true)} }>show</button>
      </div>
    )
  } else {
    let displayWeather = true
    if (Object.keys(weather).length === 0) { displayWeather = false }
    console.log("weather", weather)
    if(displayWeather) {
      return (
        <div>
          <h2>{country.name}</h2>
          <button onClick={ () => { setShow(false)} }>hide</button>
          <p>
            capital: {country.capital}<br />
            population: {country.population}
          </p>
          <h3>languages</h3>
          <ul>
            {country.languages.map( (language, index) => <li key={index}>{language.name}</li>)}
          </ul>
          <img src={country.flag} alt={`Flag of ${country.name}`} width="150" />
          <h3>Weather in {country.capital}</h3>
          <strong>temperature: </strong>{weather.current.temperature} Celcius <br />
          <img src={weather.current.weather_icons[0]} alt={`Weather icon for ${weather.current.weather_descriptions[0]}`} /> <br />
          <strong>wind: </strong> {Math.round(weather.current.wind_speed*0.621371)} mph {weather.current.wind_dir}
        </div>
      )
    } else {
      return (
        <div>
          <h2>{country.name}</h2>
          <button onClick={ () => {setShow(false)} }>hide</button>
          <p>
            capital: {country.capital}<br />
            population: {country.population}
          </p>
          <h3>languages</h3>
          <ul>
            {country.languages.map( (language, index) => <li key={index}>{language.name}</li>)}
          </ul>
          <img src={country.flag} width="150" />
        </div>
      )
    }
  }
}

const Results = ( {results} ) => {

  if      (results.length === 0)  { return (<p>No results were found</p>) }
  else if (results.length === 1)  { return (<Country country={results[0]} state={true}/>) }
  else if (results.length  > 10)  { return (<p>Too many matches, specify another filter</p>) }
  else { return (
      <>
        {results.map( (result, index) => <Country key={result.name} country={result} state={false} />)}
      </>
    )
  }


}

const App = () => {

  const [data, setData] = useState([])

  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])

  const getData = () => {
    axios
      .get("https://restcountries.eu/rest/v2/all")
      .then( response => {
        console.log("promise fulfilled!")
        setData(response.data)
        console.log(data)
      } )
      .catch( error => {
        console.log("failed to get initial data from api")
      })
  }

  const updateResults = () => {
    console.log("updating results...")
    if(search.length === 0) {
      setResults( [] )
    } else {
      setResults( data.filter( country => country.name.toLowerCase().includes( search.toLowerCase() ) ) )
      console.log("updated countryData", results)
    }
  }

  useEffect(getData, [])
  useEffect(updateResults, [search] )

  return (
    <div>
      find countries <input value={search} onChange={ (event) => {
          console.log("search", event.target.value.length)
          setSearch(event.target.value)
        }
      }/>
      <Results results={results} />
    </div>
  )
}

export default App;
