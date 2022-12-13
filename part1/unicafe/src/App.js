import { useState } from 'react'

const Header = ({text}) => <h1>{text}</h1>

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const StatisticsLine = (props) => {
  return (
    <p>{props.text} {props.value}</p>
  )
}

const Statistics = (props) => {
  const sum = props.good + props.neutral + props.bad

  if (sum !== 0) {
    return (
      <>
      <StatisticsLine text='good' value={props.good} />
      <StatisticsLine text='neutral' value={props.neutral} />
      <StatisticsLine text='bad' value={props.bad} />
      <StatisticsLine text='all' value={sum} />
      <StatisticsLine text='average' value={sum / 3} />
      <StatisticsLine text='positive' value={(props.good / sum) * 100 + '%'} />
      </>
    )
  }
  return (
    <>
      <p>No feedback given</p>
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
      <h1>statistics</h1>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
      />
    </div>
  )
}

export default App;
