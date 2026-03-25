# Guia de instalacion paso a paso de Cypress

Este documento explica como crear, instalar y ejecutar un proyecto Cypress desde cero, usando una estructura parecida a la de este repositorio.

## 1. Requisitos previos

Antes de empezar, asegurate de tener instalado:

- Node.js 22.x
- npm 10 o superior
- Un editor como VS Code

Puedes validar tu entorno con:

```bash
node -v
npm -v
```

## 2. Crear la carpeta del proyecto

Crea una carpeta nueva y entra en ella:

```bash
mkdir mi-proyecto-cypress
cd mi-proyecto-cypress
```

## 3. Inicializar el proyecto con npm

Genera el archivo `package.json`:

```bash
npm init -y
```

Esto crea la base del proyecto Node.

## 4. Instalar Cypress

Instala Cypress como dependencia de desarrollo:

```bash
npm install -D cypress
```

Si vas a trabajar con TypeScript, instala tambien:

```bash
npm install -D typescript
```

Recomendacion:

- Usa una version de TypeScript compatible con la version de Cypress que tengas instalada.
- En este proyecto se uso `typescript@5.9.x` con `cypress@15.12.0`.

## 5. Abrir Cypress por primera vez

Ejecuta:

```bash
npx cypress open
```

La primera vez, Cypress crea automaticamente la estructura base del proyecto, por ejemplo:

```text
cypress/
|-- e2e/
|-- fixtures/
|-- support/
cypress.config.js
```

Si usas TypeScript, puedes renombrar la configuracion a:

```text
cypress.config.ts
```

## 6. Instalar y configurar TypeScript

Si quieres usar tests `.ts`, crea un archivo `tsconfig.cypress.json`.

Ejemplo:

```json
{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["es2020", "dom"],
    "module": "Node16",
    "moduleResolution": "node16",
    "types": ["cypress", "node"],
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "skipLibCheck": true
  },
  "include": [
    "cypress.config.ts",
    "cypress/**/*.ts"
  ]
}
```

Tambien puedes dejar un `tsconfig.json` principal sencillo:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.cypress.json" }
  ]
}
```

## 7. Configurar Cypress

Ejemplo de `cypress.config.ts`:

```ts
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: '', // Ruta donde Cypress buscará los archivos de pruebas (puedes cambiar la carpeta o el patrón)
    baseUrl: '',// URL base de la aplicación que vas a probar (local, staging o producción)
    viewportWidth: , // Ancho de la pantalla en píxeles para simular el navegador
    viewportHeight: , // Alto de la pantalla en píxeles
    video: , // true o false: define si se graban videos de las pruebas
    screenshotOnRunFailure: , // true o false: toma capturas automáticamente cuando una prueba falla
    setupNodeEvents() {},
  },
})
```

Puntos importantes:

- `baseUrl`: evita repetir la URL en todos los tests
- `viewportWidth` y `viewportHeight`: fijan el tamano de pantalla
- `video` y `screenshotOnRunFailure`: ayudan a controlar evidencias


## 8. Crear tu primer test

Crea un archivo como:

```text
cypress/e2e/login.cy.ts
```

Contenido de ejemplo:

```ts
describe('Login', () => {
  it('Iniciar sesion correctamente', () => {
    cy.visit('/')
    cy.get('#user-name').type('standard_user')
    cy.get('#password').type('secret_sauce')
    cy.get('#login-button').click()
    cy.url().should('include', '/inventory.html')
  })
})
```

## 9. Crear comandos personalizados

Si una accion se repite mucho, conviene moverla a `cypress/support/commands.ts`.

Ejemplo:

```ts
export {}

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/')
  cy.get('#user-name').type(username)
  cy.get('#password').type(password)
  cy.get('#login-button').click()
})
```

Y en `cypress/support/e2e.ts`:

```ts
import './commands'
```

Luego puedes usarlo asi:

```ts
cy.login('standard_user', 'secret_sauce')
```

## 10. Agregar scripts en package.json

Ejemplo recomendado:

```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "cypress:run:chrome": "cypress run --browser chrome",
    "cypress:verify": "cypress verify"
  }
}
```

## 11. Ejecutar el proyecto

### Modo visual

Abre la interfaz de Cypress:

```bash
npm run cypress:open
```

Sirve para:

- desarrollar tests
- depurar fallos
- ver la ejecución paso a paso

### Modo headless

Ejecuta toda la suite sin interfaz:

```bash
npm run cypress:run
```

Ideal para:

- CI/CD
- validaciones rapidas
- pipelines automatizados

### Ejecutar en un navegador especifico

```bash
npm run cypress:run:chrome
```

### Verificar la instalacion de Cypress

```bash
npm run cypress:verify
```

## 12. Estructura recomendada del proyecto

```text
mi-proyecto-cypress/
|-- cypress/
|   |-- e2e/
|   |-- fixtures/
|   `-- support/
|-- cypress.config.ts
|-- package.json
|-- tsconfig.json
`-- tsconfig.cypress.json
```

## 13. Buenas practicas recomendadas

- Mantener los tests separados por flujo funcional
- Usar `beforeEach()` para preparar contexto comun
- Crear comandos personalizados para acciones repetidas
- Preferir selectores `data-test` o `data-cy`
- Validar resultados visibles con `should()`
- Evitar que un test dependa del anterior
- Mantener TypeScript alineado con Cypress

## 14. Problemas comunes

### Cypress no detecta tests

Revisa:

- que los archivos terminen en `.cy.ts` o `.cy.js`
- que `specPattern` apunte a la carpeta correcta
- que no haya errores de compilacion TypeScript

### Error de TypeScript al abrir Cypress

Revisa:

- version de `typescript`
- version de `cypress`
- configuracion en `tsconfig.cypress.json`

### Cypress no arranca correctamente

Puedes probar:

```bash
npx cypress cache clear
npm run cypress:verify
```

Y confirmar que estas usando una version de Node soportada.

## 15. Ejemplo de flujo completo desde cero

```bash
mkdir mi-proyecto-cypress
cd mi-proyecto-cypress
npm init -y
npm install -D cypress typescript
npx cypress open
```

Despues:

1. crear `cypress.config.ts`
2. crear `tsconfig.cypress.json`
3. escribir el primer spec en `cypress/e2e/`
4. agregar scripts al `package.json`
5. ejecutar `npm run cypress:open` o `npm run cypress:run`

## Resumen

Para crear y ejecutar un proyecto Cypress necesitas:

- instalar Node y npm
- inicializar el proyecto con npm
- instalar Cypress
- crear la configuracion
- escribir los tests
- ejecutar en modo visual o headless
