## Project Description

This project is built using microservices architecture and utilizes Docker containers to deploy two microservices: Mongo and User Service. The aim of the project is to provide a scalable and efficient system for managing user data.

The Mongo microservice is responsible for handling data storage and retrieval operations, utilizing MongoDB as the database. It ensures the persistence and management of user-related information.

The User Service microservice acts as the main application logic layer, providing functionalities for user authentication, user profile management, and other user-related operations. It communicates with the Mongo microservice to store and retrieve user data.

To facilitate the communication between the microservices and handle routing, Nginx is employed as the API gateway. Nginx acts as a reverse proxy, directing incoming requests to the appropriate microservice based on the defined routes.

The project can be easily set up and deployed using Docker Compose. The Docker Compose file defines the configuration for the entire system, allowing for easy containerization and orchestration of the microservices.

Overall, this project offers a modular and scalable solution for managing user data using microservices, with Docker and Nginx enhancing the ease of deployment and communication within the system.

## Microsevices

- Micro-service APIs
- Docker & Docker Compose
- NGINX
- Node 6.x
- Express 4.0
- MongoDB
- TypeScript

## Getting Started

### Pre-reqs

- [Docker](https://docs.docker.com/engine/installation/)
- [Docker Compose](https://docs.docker.com/compose/)

### Running

Install and start docker by `docker-compose up --build`.

# Project tree

```

├── README.md
├── docker-compose.yml
├── mongo
│   └── db
│       ├── WiredTiger
│       ├── WiredTiger.lock
│       ├── WiredTiger.turtle
│       ├── WiredTiger.wt
│       ├── WiredTigerHS.wt
│       ├── _mdb_catalog.wt
│       ├── collection-0-346179744032957225.wt
│       ├── collection-2-346179744032957225.wt
│       ├── collection-4-346179744032957225.wt
│       ├── index-1-346179744032957225.wt
│       ├── index-3-346179744032957225.wt
│       ├── index-5-346179744032957225.wt
│       ├── index-6-346179744032957225.wt
│       ├── journal
│       │   ├── WiredTigerLog.0000000026
│       │   ├── WiredTigerPreplog.0000000001
│       │   └── WiredTigerPreplog.0000000002
│       ├── mongod.lock
│       ├── sizeStorer.wt
│       └── storage.bson
├── nginx
│   ├── Dockerfile
│   └── nginx.conf
├── package-lock.json
├── package.json
├── user
└── users
    ├── Dockerfile
    ├── LICENSE
    ├── debug.log
    ├── jest.config.js
    ├── nodemon.json
    ├── package-lock.json
    ├── package.json
    ├── src
    │   ├── app.ts
    │   ├── config
    │   │   └── index.ts
    │   ├── controllers
    │   │   └── user.contoller.ts
    │   ├── database
    │   │   ├── connection.ts
    │   │   ├── models
    │   │   │   └── users.ts
    │   │   └── repository
    │   │       └── user.repository.ts
    │   ├── index.ts
    │   ├── middleware
    │   ├── public
    │   ├── routes
    │   │   └── user.route.ts
    │   ├── services
    │   │   └── userService.ts
    │   ├── types
    │   │   ├── index.ts
    │   │   └── userType.d.ts
    │   └── util
    │       └── index.ts
    ├── test
    │   ├── integration
    │   │   └── user.integration.test.ts
    │   └── unit
    │       └── user.unit.test.ts
    ├── tsconfig.json
    └── views

```
