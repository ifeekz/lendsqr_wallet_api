## Design Document

### Design Pattern
#### Adopted a Layered Approach
![Layered Architecture](public/images/layered-architecture.png "Layered Architecture")

Recalling the objectives for layered architecture, I followed the "separation of concerns" principle during development. By dividing the codebase into three categories – *business logic*, *database*, and *API routes*, which fall into three different layers, service layer, controller layer, and data access layer. The idea is to separate the business logic from Node.js API routes to avoid complex background processes.

**Controller layer** – This layer defines the API routes. The route handler functions let you deconstruct the request object, collect the necessary data pieces, and pass them on to the service layer for further processing.

**Service layer** – This layer is responsible for executing the business logic. It includes classes and methods that follow S.O.L.I.D programming principles, perform singular responsibilities, and are reusable. The layer also decouples the processing logic from the defining point of routes.

**Data access layer** – Responsible for handling database, this layer fetches from, writes to, and updates the database. It also defines SQL queries, database connections, models, ORMs, etc.

The three-layered setup acts as a reliable arrangement for Node.js applications. These stages make the application easier to code, maintain, debug and test.

#### Used dependency injection
Dependency injection is a software design pattern that advocates passing (injecting) dependencies (or services) as parameters to modules instead of requiring or creating specific ones inside them. This is a fancy term for a fundamental concept that keeps your modules more flexible, independent, reusable, scalable, and easily testable across the application.

#### Utilized third-party solutions
Node.js has a vast developer community across the world. In addition, Node.js offers a package manager, NPM, which is full of feature-rich, well-maintained, well-documented frameworks, libraries, and tools. Therefore, I conveniently plugged several existing solutions into my code and make the most of their APIs.

Some of the Node.js libraries used to enhance my coding workflows are:
- Nodemon (automatically restarts the app when there’s a code update)
- Winston (logging)
- ESLint, Prettier (code formatter)
- Swagger (API document)
- REST Client (HTTP client tools)
- PM2 (Advanced, Production process manager for Node.js)
- SWC (a super-fast JavaScript / TypeScript compiler)
- Makefile (This is a setting file of the make program used to make the compilation that occurs repeatedly on Linux)
- NGINX (Web server)
- Docker (Container platform)