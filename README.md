# Pruebas Cypress - saucedemo.com

Proyecto de testing End-to-End con Cypress + TypeScript sobre la aplicacion demo [saucedemo.com](https://www.saucedemo.com).

## Requisitos

- Node.js 22.x
- npm 10 o superior

## Estructura del proyecto

```text
Pruebas-cypress/
|-- .github/
|   `-- workflows/
|       `-- cypress.yml
|-- cypress/
|   |-- e2e/
|   |   |-- login.cy.ts
|   |   |-- products.cy.ts
|   |   |-- cart.cy.ts
|   |   `-- checkout.cy.ts
|   |-- fixtures/
|   |   `-- users.json
|   `-- support/
|       |-- commands.ts
|       `-- e2e.ts
|-- cypress.config.ts
|-- tsconfig.json
|-- tsconfig.cypress.json
`-- package.json
```

## Scripts

```bash
npm run cypress:open
npm run cypress:run
npm run cypress:run:chrome
npm run cypress:verify
npm run cy:smoke
```

## Notas de configuracion

- El proyecto usa `cypress@15.12.0` con `typescript@5.9.x` para evitar errores de compilacion al cargar specs `.ts`.
- La configuracion de TypeScript para Cypress vive en `tsconfig.cypress.json`.
- El workflow de GitHub Actions usa Node 22 para mantener el mismo runtime que desarrollo local.

## Usuarios de prueba

| Usuario | Password | Comportamiento |
| --- | --- | --- |
| `standard_user` | `secret_sauce` | Funciona normalmente |
| `locked_out_user` | `secret_sauce` | Acceso bloqueado |
| `problem_user` | `secret_sauce` | Imagenes rotas |
| `performance_glitch_user` | `secret_sauce` | Login lento |
