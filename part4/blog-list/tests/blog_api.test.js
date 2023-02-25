const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

jest.setTimeout(100000)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const res = await api.get('/api/blogs')

  expect(res.body).toHaveLength(helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const res = await api.get('/api/blogs')

  const blogs = res.body.map(r => r.title)
  expect(blogs).toContain(
    'REST API'
  )
})

test('the unique identifier property of blog posts is named id', async () => {
  const res = await api.get('/api/blogs')

  for (let blog of res.body) {
    expect(blog.id).toBeDefined()
  }
})

test('a blog can be added', async () => {
  const newBlog = {
    title: 'Code refactoring',
    author: 'Martin Fowler',
    url: 'www.martinfowler.com',
    likes: 82
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  const blogs = blogsAtEnd.map(r => ({ title: r.title, author: r.author, url: r.url, likes: r.likes }))

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  expect(blogs).toContainEqual(newBlog)
})

describe('A blog missing', () => {
  test('the likes property defaults to 0 likes', async () => {
    const newBlog = {
      title: 'Newline at the end of files',
      author: 'anonymous',
      url: 'www.stackoverflow.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
  })

  test('the title property responds with status code 400 Bad Request', async () => {
    const noTitleBlog = {
      author: 'John Doe',
      url: 'www.webzone.com',
      likes: 4
    }

    await api
      .post('/api/blogs')
      .send(noTitleBlog)
      .expect(400)

    const notesAtEnd = await helper.blogsInDb()

    expect(notesAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('the url property responds with status code 400 Bad Request', async () => {
    const noUrlBlog = {
      title: 'Lodash library',
      author: 'Ivan Ivanovsky'
    }

    await api
      .post('/api/blogs')
      .send(noUrlBlog)
      .expect(400)

    const notesAtEnd = await helper.blogsInDb()

    expect(notesAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
