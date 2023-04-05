import { useState } from "react"

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    padding: 10,
    background: '#efefef',
    margin: 10
  }

  const detailsStyle = {
    display: visible ? '' : 'none',
    paddingLeft: 16
  }

  return (
    <div style={blogStyle}>
      <div>
        <strong>{blog.title}</strong> by {blog.author} <button onClick={toggleVisibility}>{visible ? 'Hide' : 'View'}</button>
      </div>
      <div style={detailsStyle}>
        <p>{blog.url}</p>
        <p>{blog.likes} likes <button>👍</button></p>
        <p>{blog.user.name}</p>
      </div>
    </div>
)}

export default Blog
