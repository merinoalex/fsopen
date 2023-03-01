const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')

jest.setTimeout(100000)

describe('When there are initially some blogs saved,', () => {
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

  describe('Deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[1]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
      )

      expect(blogsAtEnd).not.toContain(blogToDelete)
    })

    test('succeeds with status code 204 if blog doesn\'t exist', async () => {
      const validNonExistingId = await helper.nonExistingId()

      await api
        .delete(`/api/blogs/${validNonExistingId}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .delete(`/api/blogs/${invalidId}`)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
  })

  describe('Update of a blog entry', () => {
    test('succeeds with status code 204 and returns the new object', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        title: 'REST API',
        author: 'Roy Fielding',
        url: 'www.blog.com',
        likes: 67 // new likes
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const likes = blogsAtEnd.map(r => r.likes)

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
      expect(blogsAtEnd).not.toContainEqual(blogToUpdate)
      expect(likes[0]).toBe(updatedBlog.likes)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      const blogsAtStart = await helper.blogsInDb()

      const updatedBlog = {
        title: 'placeholder',
        url: 'placeholder'
      }

      await api
        .put(`/api/blogs/${invalidId}`)
        .send(updatedBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toEqual(blogsAtStart)
    })
  })
})

describe('When there is initially one user in the DB,', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('geheim', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'amerino',
      name: 'Alex Merino',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper status code and message if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
