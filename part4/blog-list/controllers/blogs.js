const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({}).populate('user', { blogs: 0 })

  res.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
  if (!req.token) {
    return res.status(401).json({ error: 'Token must be provided' })
  }

  const body = req.body

  const user = req.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (!blog) return res.status(404).json({ error: 'Blog doesn\'t exist' })

  const user = req.user

  if (blog.user.toString() === req.user.id.toString()) {
    await Blog.findByIdAndRemove(blog.id)
    user.blogs = user.blogs.filter(b => b.toString() !== blog.id.toString())
    await user.save()

    res.status(204).end()
  } else {
    return res.status(401).json({ error: 'Invalid user' })
  }
})

blogsRouter.put('/:id', middleware.userExtractor, async (req, res) => {
  if (!req.token) {
    return res.status(401).json({ error: 'Token must be provided' })
  }

  const body = req.body

  const user = req.user

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
  res.status(204).json(updatedBlog).end()
})

module.exports = blogsRouter
