/// <reference types="cypress" />

// Necesario para que "declare global" funcione en un modulo TS
export {}

declare global {
    namespace Cypress{
        interface Chainable {
            login(username: string, password: string): Chainable<void>
            addToCart(productName: string): Chainable<void>
        }
    }
}


/**
 * comando para hacer login en saucedemo.com
 * Uso: cy.login('standard_user', 'secret_sauce')
 */
Cypress.Commands.add('login', (username: string, password: string) => {
    cy.visit('/')
    cy.get('#user-name').type(username)
    cy.get('#password').type(password)
    cy.get('#login-button').click()
})


/**
 * Comando para agregar un producto al carrito por su nombre
 * Uso: cy.addToCart('Sauce Labs Backpack)
 */
Cypress.Commands.add('addToCart', (productName: string) => {
    cy.contains('.inventory_item_name', productName)
    .parents('.inventory_item')
    .find('button')
    .click()
})
