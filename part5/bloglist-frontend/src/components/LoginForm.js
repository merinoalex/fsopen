import { useState  } from 'react'
import Notification from './Notification'

const LoginForm = ({
  info,
  handleLogin
}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    handleLogin({
      username,
      password
    })
    setUsername('')
    setPassword('')
  }
  
  return (
    <div>
    <h2>Log in to Application</h2>

    <Notification info={info} />

    <form onSubmit={handleSubmit}>
      <div>
        Username: 
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password: 
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
  )
}

export default LoginForm
