import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [info, setInfo] = useState({ message: null })

  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

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

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      notifyWith('Wrong username or password entered.', 'error')
    }
  }

  const handleLogout = (e) => {
    window.localStorage.removeItem('loggedBlogAppUser')
    window.location.reload()
  }

  const addBlog = async (blogObject) => {
    const newBlog = await blogService.create(blogObject)
    
    try {
      const blogs = await blogService.getAll()

      setBlogs(blogs)

      notifyWith(`New blog added: '${newBlog.title}' by ${newBlog.author}.`)
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      console.log(exception)
    }
  }

  const updateBlog = async (editedBlog) => {
    const id = editedBlog.id

    try {
      await blogService.update(id, editedBlog)

      const blogs = await blogService.getAll()
      
      setBlogs(blogs)
    } catch (exception) {
      console.log(exception)
    }
  }

  return (
    <div>
      <h1>Blogs App</h1>

      {!user &&
        <Togglable buttonLabel='Log in'>
          <LoginForm
            info={info}
            handleLogin={handleLogin}
          />
        </Togglable>
      }
      {user && 
        <div>
          <h2>Blogs</h2>

          <Notification info={info} />

          <p>
            {user.name} is logged in. 
            <button onClick={handleLogout}>Logout</button>
          </p>

          <Togglable buttonLabel="Add blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>

          <BlogList
            blogs={blogs}
            updateBlog={updateBlog}
          />
        </div>
      }
    </div>
  )
}

export default App