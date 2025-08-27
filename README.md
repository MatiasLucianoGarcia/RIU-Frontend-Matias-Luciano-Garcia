# Heroes App

## Estructura del Proyecto

El proyecto está organizado en módulos y carpetas para facilitar la escalabilidad y el mantenimiento. Los principales componentes y servicios relacionados con la gestión de héroes son:

### 1. HeroList
- Ubicación: `src/app/features/heroes/pages/heroes-list/`
- Componente encargado de mostrar la lista de héroes, filtrar, paginar y gestionar acciones como editar y eliminar.
- Utiliza el componente `HeroCard` para mostrar cada héroe.

### 2. HeroService
- Ubicación: `src/app/features/heroes/services/hero-service.ts`
- Servicio que expone métodos para interactuar con los datos de héroes (cargar, filtrar, paginar, eliminar, etc.).
- Sirve como puente entre la UI y el store/repositorio.

### 3. HeroStore
- Ubicación: `src/app/features/heroes/state/hero-store.ts`
- Store reactivo que mantiene el estado de los héroes, filtros, paginación y loading.
- Expone señales para que los componentes se actualicen automáticamente.

### 4. HeroRepository
- Ubicación: `src/app/features/heroes/data/hero-repository.ts`
- Encapsula la lógica de acceso a datos (simulación de CRUD sobre héroes).
- Puede ser reemplazado fácilmente por una implementación real con HTTP.

## Levantar la App con Docker

El proyecto incluye configuración para Docker y Docker Compose. Para levantar la aplicación, simplemente ejecuta:

```bash
docker-compose up --build
```

Esto construirá la imagen y levantará el contenedor con la app lista para usar.

## Otros detalles
- El proyecto utiliza Angular standalone components y signals.
- El flujo de datos es: `HeroRepository` → `HeroStore` → `HeroService` → Componentes (`HeroList`, `HeroCard`).
- Los tests unitarios cubren los principales servicios y componentes.

## Posibles mejoras
- Podriamos utilizar algun servicio para guardar el store (o parte de el) en local storage.
- El acceso a signals podria del hero-service podria haber sido mediante getters
- El interceptor utilizado podria haber sido construido de otra forma, esta asi para poder simular una llamada a un API.
- El setting en loading de la app se podria haber utilizado tambien en la busqueda del filtro para mejorar la experiencia.
- La UI es mejorable en varios aspectos. 

---
# HeroesApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.2.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.