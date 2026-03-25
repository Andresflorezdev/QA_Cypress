# Guia de buenas practicas de Cypress

Este documento complementa el README principal y resume buenas practicas de Cypress usando como referencia este proyecto sobre `saucedemo.com`.

## Objetivo

- Mantener pruebas E2E legibles, confiables y faciles de mantener.
- Reutilizar acciones comunes con comandos personalizados.
- Evitar flakiness usando aserciones claras y selectores estables.

## Buenas practicas aplicadas en este proyecto

### 1. Separar pruebas por flujo funcional

Los specs estan organizados por dominio:

- `login.cy.ts`
- `products.cy.ts`
- `cart.cy.ts`
- `checkout.cy.ts`

Esto ayuda a que cada archivo tenga una responsabilidad clara y que los fallos sean mas faciles de ubicar.

### 2. Reutilizar acciones repetidas con comandos personalizados

En lugar de repetir el flujo de login o la logica para agregar productos al carrito en cada test, el proyecto define comandos en `cypress/support/commands.ts`.

Comandos creados:

- `cy.login(username, password)`
- `cy.addToCart(productName)`

Beneficios:

- Menos duplicacion
- Tests mas cortos y legibles
- Cambios centralizados si la UI cambia

### 3. Usar `beforeEach()` para preparar el estado

En varios specs se usa `beforeEach()` para iniciar sesion antes de cada prueba. Esto mantiene cada test independiente y evita dependencia entre casos.

Ejemplo de enfoque:

```ts
beforeEach(() => {
  cy.login('standard_user', 'secret_sauce')
})
```

### 4. Validar comportamiento, no solo clicks

Despues de cada accion importante se valida el resultado esperado:

- Cambio de URL con `cy.url().should(...)`
- Visibilidad de elementos con `should('be.visible')`
- Conteo de items con `should('have.length', ...)`
- Mensajes de error con `should('contain', ...)`

Esto hace que el test confirme valor de negocio y no solo ejecute pasos.

### 5. Preferir selectores estables

En Cypress conviene priorizar:

- `data-test`
- `data-cy`
- `data-testid`

En este proyecto tambien se usan clases e IDs porque la app demo ya viene asi, por ejemplo:

- `#login-button`
- `.inventory_item`
- `[data-test="checkout"]`

Recomendacion:

- En aplicaciones propias, priorizar siempre atributos `data-*` dedicados a testing.
- Evitar depender demasiado de clases visuales si pueden cambiar por CSS o rediseño.

### 6. Mantener tests pequenos y con una intencion clara

Cada `it(...)` prueba un comportamiento concreto:

- login exitoso
- credenciales invalidas
- ordenamiento por precio
- eliminar producto del carrito
- error por formulario incompleto

Eso hace que el motivo del fallo sea evidente.

### 7. Usar fixtures para datos reutilizables

En login se cargan usuarios desde `cypress/fixtures/users.json` usando `cy.fixture()`.

Beneficios:

- Datos desacoplados del test
- Mayor claridad
- Facil extension de escenarios

### 8. Evitar dependencias entre tests

Cada prueba prepara su propio contexto. No se asume que un test anterior dejo al usuario logueado ni que el carrito ya contiene productos. Eso reduce fallos intermitentes.

### 9. Configurar Cypress explicitamente

En `cypress.config.ts` se declaran opciones importantes:

- `baseUrl`
- `specPattern`
- `viewportWidth`
- `viewportHeight`
- `video`
- `screenshotOnRunFailure`

Esto hace el entorno mas predecible tanto en local como en CI.

### 10. Mantener TypeScript alineado con Cypress

Una practica importante en este repo es usar una version de TypeScript compatible con Cypress y una configuracion dedicada en `tsconfig.cypress.json`.

Esto evita errores de compilacion al cargar specs `.ts`.

## Funciones y comandos usados en el proyecto

### Comandos personalizados

#### `cy.login(username, password)`

Ubicacion: `cypress/support/commands.ts`

Responsabilidad:

- Visita la raiz de la aplicacion
- Completa usuario y password
- Ejecuta el submit del login

Ejemplo:

```ts
cy.login('standard_user', 'secret_sauce')
```

#### `cy.addToCart(productName)`

Ubicacion: `cypress/support/commands.ts`

Responsabilidad:

- Busca un producto por nombre
- Navega hasta su contenedor
- Hace click en el boton para agregarlo al carrito

Ejemplo:

```ts
cy.addToCart('Sauce Labs Backpack')
```

## Funciones nativas de Cypress utilizadas

### `describe()`

Agrupa casos de prueba relacionados dentro de una suite.

### `it()`

Define un escenario de prueba individual.

### `beforeEach()`

Ejecuta pasos comunes antes de cada test. En este proyecto se usa para login y preparacion del carrito.

### `cy.visit()`

Abre una pagina. En el comando `login()` se usa con `/`, aprovechando `baseUrl`.

### `cy.get()`

Busca elementos por selector CSS.

Ejemplos usados:

```ts
cy.get('#login-button')
cy.get('.inventory_item')
cy.get('[data-test="checkout"]')
```

### `cy.contains()`

Busca un elemento por texto visible. Se usa para localizar productos por nombre.

Ejemplo:

```ts
cy.contains('.inventory_item_name', 'Sauce Labs Backpack')
```

### `cy.type()`

Escribe texto en campos de formulario.

### `cy.click()`

Hace click sobre un elemento.

### `cy.select()`

Selecciona una opcion en un `<select>`. Se usa para ordenar productos.

### `cy.url()`

Obtiene la URL actual para hacer validaciones de navegacion.

### `cy.fixture()`

Carga datos desde `cypress/fixtures`. Se usa para usuarios de prueba.

Ejemplo:

```ts
cy.fixture<Users>('users').as('users')
```

### `cy.as()`

Guarda un alias para reutilizar datos dentro del test.

### `cy.first()`

Toma el primer elemento de una coleccion. Se usa para validar el primer precio despues del ordenamiento.

### `cy.invoke()`

Llama un metodo sobre el subject actual, por ejemplo obtener el texto.

Ejemplo:

```ts
cy.get('.inventory_item_price').first().invoke('text')
```

### `cy.then()`

Permite trabajar con el valor resuelto en la cadena de Cypress.

### `cy.should()`

Realiza aserciones sobre el estado del elemento o valor actual.

Aserciones usadas en el proyecto:

- `be.visible`
- `have.length`
- `have.text`
- `contain`
- `include`
- `eq`
- `not.exist`

### `cy.and()`

Encadena una asercion adicional despues de `should()`.

### `cy.parents()`

Sube en el DOM hasta un contenedor ancestro. Se usa dentro de `addToCart()`.

### `cy.find()`

Busca elementos descendientes a partir del subject actual.

## Recomendaciones para seguir mejorando el proyecto

- Agregar mas selectores `data-test` si el proyecto deja de usar una app demo.
- Incorporar Page Objects solo si la complejidad crece; por ahora los comandos personalizados ya cubren bien la reutilizacion.
- Agregar pruebas negativas y de borde para checkout, por ejemplo formatos invalidos de codigo postal.
- Considerar `cy.intercept()` si en el futuro necesitan controlar respuestas de red o acelerar escenarios.
- Mantener los mensajes de los tests claros y orientados al comportamiento esperado.

## Resumen rapido

La base actual del proyecto es buena porque:

- separa specs por flujo
- reutiliza acciones comunes
- valida resultados visibles
- usa fixtures para datos
- mantiene TypeScript alineado con Cypress

