const blog = {
  title: 'Microservices and the First Law of Distributed Objects',
  author: 'Martin Fowler',
  url: 'https://martinfowler.com/articles/distributed-objects-microservices.html'
}

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

      cy.get('input[name="Title"]').type(blog.title)
      cy.get('input[name="Author"]').type(blog.author)
      cy.get('input[name="URL"]').type(blog.url)

      cy.get('#submit-blog').click()

      cy.get('#blog-list').should('contain', blog.title)
    })

    describe('and a blog entry exists,', function() {
      beforeEach(function () {
        cy.addBlog({
          title: blog.title,
          author: blog.author,
          url: blog.url
        })
      })

      it('users can like a blog entry', function() {
        cy.get('#blog-list').contains('View').click()

        cy.get('button').contains('👍').click()

        cy.get('#blog-list').should('contain', '1 likes')
      })
    })
  })
})