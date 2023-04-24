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
})