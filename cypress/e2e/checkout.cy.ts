/// <reference types="cypress" />

describe('Checkout', () => {
  beforeEach(() => {
    cy.login('standard_user', 'secret_sauce');
    cy.addToCart('Sauce Labs Backpack');
    cy.get('.shopping_cart_link').click();
  });

  it('completar flujo de compra', () => {
    // Ir al checkout
    cy.get('[data-test="checkout"]').click();
    cy.url().should('include', '/checkout-step-one.html');

    // Llenar informacion personal
    cy.get('#first-name').type('Andrew');
    cy.get('#last-name').type('Hilmer');
    cy.get('#postal-code').type('110111');
    cy.get('[data-test="continue"]').click();
    cy.url().should('include', '/checkout-step-two.html');

    // verificar resumen de la orden
    cy.get('.summary_info').should('be.visible');
    cy.get('.cart_item').should('have.length', 1);

    // Finalizar la compra
    cy.get('[data-test="finish"]').click();
    cy.url().should('include', '/checkout-complete.html');
    cy.get('.complete-header').should('contain', 'Thank you for your order!');
  });

  it('mostrar error si el formulario esta incompleto', () => {
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="error"]')
      .should('be.visible')
      .and('contain', 'First Name is required');
  });

  it('Poder cancelar el checkout y volver al carrito', () => {
    cy.get('[data-test="checkout"]').click();
    cy.get('[data-test="cancel"]').click();
    cy.url().should('include', '/cart.html');
  });
});
