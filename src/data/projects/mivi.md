I am building Mivi as a <mark>self-hosted photo and video library</mark> for web and Android. The product is centered on keeping a personal collection on a server its owner controls, while allowing the same library to be used from a browser and a phone.

## One API, two clients

The implementation is organized around a TypeScript API and a <mark>shared contract</mark> consumed by both clients. I am developing the backend and interfaces together so that the web and Android experiences use the same operations and agree on how they communicate with the server.

## The current foundation

The current foundation establishes how clients connect, how state is stored and where longer-running operations belong.

- <mark>Server discovery and trust</mark> help clients find and recognize a server.
- **SQLite persistence and migrations** provide the storage foundation.
- A **separate background worker** provides a place for longer-running operations.

## How I built it

I am designing the product and building the <mark>backend, web and Android clients</mark>, along with the tooling used to build and test them. Media synchronization, archival organization and backups are ongoing development work.
