/// <reference types="cypress"/>

interface Users {
    standard: {username: string, password: string};
    locked: {username: string, password: string};
    invalid: {username: string, password: string};
};

describe('login', () => {
    beforeEach(() => {
        cy.fixture<Users>('users').as('users')
    });

    it('Inicio de sesion con usuario estandar', function () {
        cy.login(this.users.standard.username, this.users.standard.password)
        cy.url().should('include', '/inventory.html')
        cy.get('.inventory_list').should('be.visible')
    });

    it('Error con credenciales incorrectas', function () {
        cy.login(this.users.invalid.username, this.users.invalid.password)
        cy.get('[data-test="error"]')
        .should('be.visible')
        .and('contain', 'Username and password do not match')
    });

    it('Bloquear al usuario locked_out_user', function () {
        cy.login(this.users.locked.username, this.users.locked.password)
        cy.get('[data-test="error"]')
        .should('be.visible')
        .and('contain', 'Sorry, this user has been locked out.')
    });

    it('Cerrar sesion correctamente', function () {
        cy.login(this.users.standard.username, this.users.standard.password)
        cy.get('#react-burger-menu-btn').click()
        cy.get('#logout_sidebar_link').click()
        cy.url().should('eq', 'https://www.saucedemo.com/')
        cy.get('#login-button').should('be.visible')
    });

});