const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'REST API',
    author: 'Roy Fielding',
    url: 'www.blog.com',
    likes: 45
  },
  {
    title: 'Structured programming',
    author: 'Edsger Dijkstra',
    url: 'www.wikipedia.com',
    likes: 102
  }
]

const nonExistingId = async () => {
  const blog = await new Blog({ title: 'placeholder', url: 'placeholder' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}
