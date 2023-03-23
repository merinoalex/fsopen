import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const [info, setInfo] = useState({ message: null })

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const notifyWith = (message, type = 'info') => {
    setInfo({
      message, type
    })

    setTimeout(() => {
      setInfo({ message: null })
    }, 3000)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notifyWith('Wrong username or password entered.', 'error')
    }
  }

  const handleLogout = (e) => {
    window.localStorage.removeItem('loggedBlogAppUser')
    window.location.reload()
  }

  const addBlog = async (e) => {
    e.preventDefault()

    const blogObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    }

    const newBlog = await blogService.create(blogObject)

    try {
      setBlogs(blogs.concat(newBlog))
      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')
      notifyWith(`New blog added: '${newBlog.title}' by ${newBlog.author}.`)
    } catch (exception) {
      console.log(exception)
    }

/*     blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlogTitle('')
        setNewBlogAuthor('')
        setNewBlogUrl('')
      }) */
  }

  const loginForm = () => (
    <div>
      <h2>Log in to Application</h2>

      <Notification info={info} />

      <form onSubmit={handleLogin}>
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

  return (
    <div>
      {!user && loginForm()}
      {user && <div>
          <h2>Blogs</h2>

          <Notification info={info} />

          <p>
            {user.name} is logged in. 
            <button onClick={handleLogout}>Logout</button>
          </p>

          <BlogForm
            addBlog={addBlog}
            newBlogTitle={newBlogTitle}
            newBlogAuthor={newBlogAuthor}
            newBlogUrl={newBlogUrl}
            setNewBlogTitle={setNewBlogTitle}
            setNewBlogAuthor={setNewBlogAuthor}
            setNewBlogUrl={setNewBlogUrl}
          />

          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
    </div>
  )
}

export default App