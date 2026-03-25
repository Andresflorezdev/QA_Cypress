/// <reference types="cypress" />

describe('Products', () => {
  beforeEach(() => {
    cy.login('standard_user', 'secret_sauce');
  });

  it('Mostrar 6 productos en el catálogo', () => {
    cy.get('.inventory_item').should('have.length', 6);
  });

  it('Ordenar productos de menor a mayor precio', () => {
    cy.get('.product_sort_container').select('lohi');
    cy.get('.inventory_item_price')
      .first()
      .invoke('text')
      .then((price: string) => {
        expect(parseFloat(price.replace('$', ''))).to.eq(7.99);
      });
  });

  it('Navegar al detalle de un producto', () => {
    cy.contains('.inventory_item_name', 'Sauce Labs Backpack').click();
    cy.url().should('include', '/inventory-item.html');
    cy.get('.inventory_details_name').should('contain', 'Sauce Labs Backpack');
    cy.get('.inventory_details_price').should('be.visible');
  });

  it('Volver al catalogo desde el detalle', () => {
    cy.contains('.inventory_item_name', 'Sauce Labs Backpack').click();
    cy.get('#back-to-products').click();
    cy.url().should('include', '/inventory.html');
  });
});
