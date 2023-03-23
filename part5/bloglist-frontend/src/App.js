import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const BlogForm = ({ addBlog, newBlogTitle, newBlogAuthor, newBlogUrl, setNewBlogTitle, setNewBlogAuthor, setNewBlogUrl }) => {
  return (
    <div>
      <h2>Add new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          Title: 
          <input
            type="text"
            value={newBlogTitle}
            name="Title"
            onChange={({ target }) => setNewBlogTitle(target.value)}
          />
        </div>
        <div>
          Author: 
          <input 
            type="text"
            value={newBlogAuthor}
            name="Author"
            onChange={({ target }) => setNewBlogAuthor(target.value)}
          />
        </div>
        <div>
          URL: 
          <input 
            type="text"
            value={newBlogUrl}
            name="URL"
            onChange={({ target }) => setNewBlogUrl(target.value)}
          />
        </div>
        <button type="submit">Add</button>
      </form>
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

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
      console.log('Wrong credentials')
    }
  }

  const handleLogout = (e) => {
    window.localStorage.removeItem('loggedBlogAppUser')
    window.location.reload()
  }

  const addBlog = (e) => {
    e.preventDefault()

    const blogObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlogTitle('')
        setNewBlogAuthor('')
        setNewBlogUrl('')
      })
  }

  const loginForm = () => (
    <div>
      <h2>Log in to Application</h2>

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