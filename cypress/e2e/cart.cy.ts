/// <reference types="cypress" />

describe('Carrito', () => {
  beforeEach(() => {
    cy.login('standard_user', 'secret_sauce');
  });

  it('Agregar un producto y mostrar badge "1"', () => {
    cy.addToCart('Sauce Labs Backpack');
    cy.get('.shopping_cart_badge').should('have.text', '1');
  });

  it('Agregar múltiples productos y mostrar el conteo correcto', () => {
    cy.addToCart('Sauce Labs Backpack');
    cy.addToCart('Sauce Labs Bike Light');
    cy.get('.shopping_cart_badge').should('have.text', '2');
  });

  it('Deberia eliminar un producto del carrito', () => {
    cy.addToCart('Sauce Labs Backpack');
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="remove-sauce-labs-backpack"]').click();
    cy.get('.cart_item').should('not.exist');
    cy.get('.shopping_cart_badge').should('not.exist');
  });

  it('Mostrar el carrito con el producto correcto', () => {
    cy.addToCart('Sauce Labs Fleece Jacket');
    cy.get('.shopping_cart_link').click();
    cy.get('.cart_item').should('have.length', 1);
    cy.get('.inventory_item_name').should(
      'contain',
      'Sauce Labs Fleece Jacket',
    );
  });
});
