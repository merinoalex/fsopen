const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

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

  describe('Adding a blog', () => {
    let token = null
    beforeEach(async () => {
      await User.deleteMany({})

      const rootUser = {
        username: 'root',
        password: 'geheim'
      }

      const passwordHash = await bcrypt.hash(rootUser.password, 10)
      const newUser = new User({ username: rootUser.username, passwordHash })

      const savedUser = await newUser.save()

      token = jwt.sign(
        { username: savedUser.username, id: savedUser._id },
        process.env.SECRET,
        { expiresIn: 60 * 60 }
      )
    })

    test('succeeds with status code 201 with a valid token', async () => {
      const newBlog = {
        title: 'Code refactoring',
        author: 'Martin Fowler',
        url: 'www.martinfowler.com',
        likes: 82
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      const blogs = blogsAtEnd.map(r => ({ title: r.title, author: r.author, url: r.url, likes: r.likes }))

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
      expect(blogs).toContainEqual(newBlog)
    })

    describe('missing', () => {
      test('a token fails with status code 401', async () => {
        const blogsAtStart = await helper.blogsInDb()

        const newBlog = {
          title: 'Newline at the end of files',
          author: 'anonymous',
          url: 'www.stackoverflow.com'
        }

        const result = await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(401)

        expect(result.body.error).toContain('Token missing')

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
      })

      test('the likes property defaults to 0 likes', async () => {
        const newBlog = {
          title: 'Newline at the end of files',
          author: 'anonymous',
          url: 'www.stackoverflow.com'
        }

        await api
          .post('/api/blogs')
          .send(newBlog)
          .set('Authorization', `Bearer ${token}`)
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
          .set('Authorization', `Bearer ${token}`)
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
          .set('Authorization', `Bearer ${token}`)
          .expect(400)

        const notesAtEnd = await helper.blogsInDb()

        expect(notesAtEnd).toHaveLength(helper.initialBlogs.length)
      })
    })
  })

  describe('Deletion of a blog', () => {
    let token = null
    beforeAll(async () => {
      await User.deleteMany({})

      const rootUser = {
        username: 'root',
        password: 'geheim'
      }

      const passwordHash = await bcrypt.hash(rootUser.password, 10)
      const newUser = new User({ username: rootUser.username, passwordHash })

      const savedUser = await newUser.save()

      token = jwt.sign(
        { username: savedUser.username, id: savedUser._id },
        process.env.SECRET,
        { expiresIn: 60 * 60 }
      )
    })

    beforeEach(async () => {
      await Blog.deleteMany({})

      const newBlog = {
        title: 'REST API',
        author: 'Roy Fielding',
        url: 'www.blog.com',
        likes: 45
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
    })

    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        blogsAtStart.length - 1
      )

      expect(blogsAtEnd).not.toContain(blogToDelete)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
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

  describe('creation fails with proper status code and message if', () => {
    test('username is already taken', async () => {
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

    test('username is missing', async () => {
      const usersAtStart = await helper.usersInDb()

      const noUsernameUser = {
        name: 'Matti Luukkainen',
        password: 'salainen'
      }

      const result = await api
        .post('/api/users')
        .send(noUsernameUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('username: Path `username` is required')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('password is missing', async () => {
      const usersAtStart = await helper.usersInDb()

      const noPasswordUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen'
      }

      const result = await api
        .post('/api/users')
        .send(noPasswordUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('Password must be given')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('invalid username is given', async () => {
      const usersAtStart = await helper.usersInDb()

      const invalidUsername = {
        username: 'ml',
        name: 'Matti Luukkainen',
        password: 'salainen'
      }

      const result = await api
        .post('/api/users')
        .send(invalidUsername)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('Path `username`', 'is shorter than the minimum allowed length')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('invalid password is given', async () => {
      const usersAtStart = await helper.usersInDb()

      const invalidPassword = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'sa'
      }

      const result = await api
        .post('/api/users')
        .send(invalidPassword)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('Password must be at least 3 characters long')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
