import Blog from './Blog'
import PropTypes from 'prop-types'

const BlogList = ({ blogs, updateBlog, loggedinUser, removeBlog }) => {
  const list = blogs.sort((a, b) => a.likes - b.likes).reverse()

  return (
    list.map(blog =>
      <Blog
        key={blog.id}
        blog={blog}
        editBlog={updateBlog}
        loggedinUser={loggedinUser}
        removeBlog={removeBlog}
      />
    )
  )
}

BlogList.propTypes = {
  blogs: PropTypes.array.isRequired,
  updateBlog: PropTypes.func.isRequired,
  loggedinUser: PropTypes.object.isRequired,
  removeBlog: PropTypes.func.isRequired
}

export default BlogList
