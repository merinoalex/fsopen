const testingRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

testingRouter.post('/reset', async (req, resp) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  resp.status(204).end()
})

module.exports = testingRouter
