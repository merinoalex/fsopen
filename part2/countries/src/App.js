import { useState, useEffect } from 'react'
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

const CountryDetails = ({ country }) => {
  const [hideCountry, setHideCountry] = useState(false)

  const handleHideCountry = () => {
    setHideCountry(true)
  }

  if (hideCountry === true) {
    return (
      <CountryName
        key={country.cca2}
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
          <img src={country.flags.png} height="150px"/>
        </div>
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
          key={c.cca2}
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
  })

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
