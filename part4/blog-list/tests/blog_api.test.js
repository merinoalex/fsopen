const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
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

jest.setTimeout(100000)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const res = await api.get('/api/blogs')

  expect(res.body).toHaveLength(initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const res = await api.get('/api/blogs')

  const contents = res.body.map(r => r.title)
  expect(contents).toContain(
    'REST API'
  )
})

test('the unique identifier property of blog posts is named id', async () => {
  const res = await api.get('/api/blogs')

  for (let blog of res.body) {
    expect(blog.id).toBeDefined()
  }
})

afterAll(async () => {
  await mongoose.connection.close()
})
