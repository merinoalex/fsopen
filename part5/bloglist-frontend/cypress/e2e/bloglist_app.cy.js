const blogs = [
  {
    title: 'Microservices and the First Law of Distributed Objects',
    author: 'Martin Fowler',
    url: 'https://martinfowler.com/articles/distributed-objects-microservices.html'
  },
  {
    title: 'Things I Don’t Know as of 2018',
    author: 'Dan Abramov',
    url: 'https://overreacted.io/things-i-dont-know-as-of-2018/',
    likes: 15
  },
  {
    title: 'On let vs const',
    author: 'Dan Abramov',
    url: 'https://overreacted.io/on-let-vs-const/',
    likes: 5
  }
]

describe('Bloglist app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Root',
      username: 'root',
      password: 'salainen'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown by default', function() {
    cy.contains('Log in').click()
    cy.contains('Log in to Application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.contains('Log in').click()

      cy.get('input[name="Username"]').type('root')
      cy.get('input[name="Password"]').type('salainen')

      cy.contains('Login').click()
    })

    it('fails with wrong credentials', function() {
      cy.contains('Log in').click()

      cy.get('input[name="Username"]').type('wrongUser')
      cy.get('input[name="Password"]').type('wrongPw')

      cy.contains('Login').click()

      cy.get('.notification').should('contain', 'Wrong username or password')
      cy.get('.notification').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('.notification').should('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in,', function() {
    beforeEach(function() {
      cy.login({ username: 'root', password: 'salainen' })
    })

    it('a new blog entry can be created', function() {
      cy.contains('Add blog').click()

      cy.get('input[name="Title"]').type(blogs[0].title)
      cy.get('input[name="Author"]').type(blogs[0].author)
      cy.get('input[name="URL"]').type(blogs[0].url)

      cy.get('#submit-blog').click()

      cy.get('#blog-list').should('contain', blogs[0].title)
    })

    describe('and a blog entry exists,', function() {
      beforeEach(function () {
        cy.addBlog({
          title: blogs[0].title,
          author: blogs[0].author,
          url: blogs[0].url
        })
      })

      it('users can like a blog entry', function() {
        cy.get('#blog-list').children(':first-child').find('button').contains('View').click()

        cy.get('#blog-list').children(':first-child').find('button').contains('👍').click()

        cy.get('#blog-list').children(':first-child').should('contain', '1 likes')
      })

      it('it can be deleted by the creator of the entry', function() {
        cy.get('#blog-list').children(':first-child').find('button').contains('View').click()

        cy.get('#blog-list').children(':first-child').find('button').contains('Remove').click()

        cy.get('#blog-list').should('be.empty')
      })

      it('it cannot be deleted by someone other than the creator of the entry', function() {
        const newUser = {
          name: 'Alex',
          username: 'alex',
          password: 'salainen'
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, newUser)

        cy.contains('Logout').click

        cy.login({ username: 'alex', password: 'salainen' })

        cy.get('#blog-list').children(':first-child').find('button').contains('View').click()

        cy.get('#blog-list').children(':first-child').find('button').should('not.contain', 'Remove')
      })
    })

    describe('and several blog entries exist,', function() {
      beforeEach(function () {
        cy.addBlog({
          title: blogs[0].title,
          author: blogs[0].author,
          url: blogs[0].url
        })

        cy.addBlog({
          title: blogs[1].title,
          author: blogs[1].author,
          url: blogs[1].url,
          likes: blogs[1].likes
        })

        cy.addBlog({
          title: blogs[2].title,
          author: blogs[2].author,
          url: blogs[2].url,
          likes: blogs[2].likes
        })
      })

      it('blog entries are ordered descending according to amount of likes', function() {
        cy.get('#blog-list').children().eq(0).should('contain', blogs[1].title)
        cy.get('#blog-list').children().eq(1).should('contain', blogs[2].title)
        cy.get('#blog-list').children().eq(2).should('contain', blogs[0].title)
      })
    })
  })
})