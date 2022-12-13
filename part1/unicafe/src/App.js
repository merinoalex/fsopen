import { useState } from 'react'

const Header = ({text}) => <h1>{text}</h1>

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const Statistics = (props) => {
  return (
    <>
      <h1>{props.title}</h1>
      <p>good {props.good}</p>
      <p>neutral {props.neutral}</p>
      <p>bad {props.bad}</p>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)

  return (
    <div>
      <Header text='give feedback' />
      <Button
        onClick={handleGood}
        text='good'
      />
      <Button
        onClick={handleNeutral}
        text='neutral'
      />
      <Button
        onClick={handleBad}
        text='bad'
      />
      <Statistics
        title='statistics'
        good={good}
        neutral={neutral}
        bad={bad}
      />
    </div>
  )
}

export default App;
