import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Country = ( {country, state} ) => {
  const [show, setShow] = useState(state)
  const [weather, setWeather] = useState({})

  const api_key = process.env.REACT_APP_WEATHER_API_KEY
  console.log(api_key)

  useEffect( () => {
    axios
      .get(`https://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}}`)
      .then( response => { setWeather(response.data) } )
  }, [])

  /*The code below was used for testing
  useEffect( () => {
    if(api_key != "1010") {
      console.log("Wrong api key")
      return
    }
    setWeather( {
      "request": {
          "type": "City",
          "query": `${country.capital}, ${country.name}`,
          "language": "en",
          "unit": "m"
      },
      "location": {
          "name": `${country.capital}`,
          "country": `${country.name}`,
          "region": "",
          "lat": "",
          "lon": "",
          "timezone_id": "",
          "localtime": "",
          "localtime_epoch": 0,
          "utc_offset": ""
      },
      "current": {
          "observation_time": "",
          "temperature": 14,
          "weather_code": 113,
          "weather_icons": [
              "https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png"
          ],
          "weather_descriptions": [
              "Sunny"
          ],
          "wind_speed": 85,
          "wind_degree": 349,
          "wind_dir": "N",
          "pressure": 1010,
          "precip": 0,
          "humidity": 90,
          "cloudcover": 0,
          "feelslike": 13,
          "uv_index": 4,
          "visibility": 16
      }
    } )
    console.log(weather)
  }, [country]) */

  if(!show) {
    return (
      <div>
        <>{country.name}</>
        <button onClick={ () => {setShow(true)} }>show</button>
      </div>
    )
  } else if (Object.keys(weather).length === 0) {
    // check if weather object has been initialized, since useEffect is only called after render
    // we would be calling undefined properties of the weather object the first time the component
    // is rendered, or any time the api request fails at first
    console.log("weather", weather)
    return ( null )
  } else {
    console.log("weather", weather)
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
        <h3>Weather in {country.capital}</h3>
        <strong>temperature: </strong>{weather.current.temperature} Celcius <br />
        <img src={weather.current.weather_icons[0]} /> <br />
        <strong>wind: </strong> {Math.round(weather.current.wind_speed*0.621371)} mph {weather.current.wind_dir}
      </div>
    )
  }
}

const Results = ( {results} ) => {

  if      (results.length === 0)  { return (<p>No results were found</p>) }
  else if (results.length === 1)  { return (<Country country={results[0]} state={true}/>) }
  else if (results.length  > 10)  { return (<p>Too many matches, specify another filter</p>) }
  else { return (
      <>
        {results.map( (result, index) => <Country key={index} country={result} state={false} />)}
      </>
    )
  }


}

const App = () => {

  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [data, setData] = useState([])

  const getData = () => {
    axios
      .get("https://restcountries.eu/rest/v2/all")
      .then( response => {
        console.log("promise fulfilled!")
        setData(response.data)
        console.log(data)
      } )
  }

  const updateResults = () => {
    console.log("updating results...")
    setResults( data.filter( country => country.name.toLowerCase().includes( search.toLowerCase() ) ) )
    console.log(results)
  }

  useEffect(getData, [])
  useEffect(updateResults, [search] )

  return (
    <div>
      find countries <input value={search} onChange={ (event) => {
          console.log(event.target.value)
          setSearch(event.target.value)
        }
      }/>
      <Results results={results} />
    </div>
  )
}

export default App;
