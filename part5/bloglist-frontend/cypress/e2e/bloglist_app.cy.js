describe('Bloglist app', function () {
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

  describe('Login', function () {
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

      cy.get('input[name="Title"]').type('Microservices and the First Law of Distributed Objects')
      cy.get('input[name="Author"]').type('Martin Fowler')
      cy.get('input[name="URL"]').type('https://martinfowler.com/articles/distributed-objects-microservices.html')

      cy.get('#submit-blog').click()

      cy.get('#blog-list').should('contain', 'Microservices and the First Law of Distributed Objects')
    })
  })
})