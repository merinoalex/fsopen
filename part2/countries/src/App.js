import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Search = ({ query, queryHandler }) => {
  return (
    <div>
      find countries: <input 
        value={query}
        onChange={queryHandler}
      />
    </div>
  )
}

const CountryName = ({ country }) => {
  const [expandCountry, setExpandCountry] = useState(false)

  const handleExpandCountry = () => {
    setExpandCountry(true)
  }

  if (expandCountry === true) {
    return (
      <CountryDetails
        country={country}
      />
    )
  } else {
    return (
      <div>
        {country.name.common} <button onClick={handleExpandCountry}>show</button>
      </div>
    )
  }
}

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${country.latlng[0]}&lon=${country.latlng[1]}&appid=${api_key}&units=metric`)
      .then(response => {
        setWeather(response.data)
      })
  }, [country])

  if (!weather) {
    return null
  } else {
  return (
    <div>
      <h3>Weather in {country.name.common}</h3>
      <p>Temperature: {weather.main.temp} °C</p>
      <img src={'http://openweathermap.org/img/wn/' + weather.weather[0].icon.replace(/d/, "n") + '@2x.png'} alt={weather.weather[0].description} />
      <p>Wind speed: {weather.wind.speed} m/s</p>
    </div>
  )}}

const CountryDetails = ({ country }) => {
  const [hideCountry, setHideCountry] = useState(false)

  const handleHideCountry = () => {
    setHideCountry(true)
  }

  if (hideCountry === true) {
    return (
      <CountryName
        key={country.ccn3}
        country={country}
      />
    )
  } else {
    return (
      <>
        <h2>{country.name.common}</h2>
        <button onClick={handleHideCountry}>hide</button>
        <div>
          <p>Capital: {country.hasOwnProperty('capital') ? country.capital[0] : 'none'}</p>
          <p>Area: {country.area}</p>
        </div>
        <div>
          <h3>Languages:</h3>
          <ul>
            {Object.values(country.languages).map((l, index) =>
              <li key={index}>{l}</li>
            )}
          </ul>
        </div>
        <div>
          <img src={country.flags.png} height="150px" alt={'Flag from ' + country.name.common}/>
        </div>
        <Weather country={country} />
      </>
    )
  }
}

const Countries = ({ countries, filter }) => {
  const showCountries = countries.filter(f =>
    JSON.stringify(f.name.common).toLocaleLowerCase()
    .includes(filter.toLocaleLowerCase()))

  if (!filter || showCountries.length === 0) {
    return
  } else if (showCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (showCountries.length === 1) {
    return (
      <CountryDetails
        country={showCountries[0]}
      />
    )
  } else {
    return (
      showCountries.map(c => 
        <CountryName 
          key={c.ccn3}
          country={c}
        />)
    )
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [newQuery, setNewQuery] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleQueryChange = (event) => {
    setNewQuery(event.target.value)
  }

  return (
    <div>
      <Search 
        query={newQuery}
        queryHandler={handleQueryChange}
      />
      <Countries 
        countries={countries}
        filter={newQuery}
      />
    </div>
  )
}

export default App
