# Projeto Final

Development of the first stage of the API Compassolisa

<p align="center">
  <img src="http://img.shields.io/static/v1?label=License&message=MIT&color=green&style=for-the-badge"/>
  <img src="http://img.shields.io/static/v1?label=Node&message=14.18.1&color=green&style=for-the-badge&logo=node.js"/>
   <img src="http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=RED&style=for-the-badge"/>
</p>

## Summary

[Resources](#resources)

[Example for .ENV and .ENV.TEST](#example-for-.env-and-.env.test)

[Instaling with npm](#instaling-with-npm)

[Running Locally](#running-locally)

[Running with docker-compose](#running-with-docker-compose)

[Routes](#routes)

[License](#license)

## RESOURCES

- Node.JS v.14.18.1
- MongoDB v.5.0.3
- Dependencies:
  - @joi/date v.2.1.0
  - axios 0.24.0
  - bcryptjs v.2.4.3
  - Joi v17.4.2
  - dotenv v.10.0.0
  - express v.4.17.1
  - jsonwebtoken v.8.5.1
  - moment v.2.29.1
  - mongoose v.6.0.11
  - swagger-ui-express v.4.1.6
- Development dependencies:
   - @babel/cli 7.15.7
   - @babel/core 7.15.8
   - @babel/preset-env 7.15.8
   - @babel/preset-typescript 7.15.0
   - @types/bcryptjs 2.4.2",
   - @types/express 4.17.13
   - @types/factory-girl 5.0.8
   - @types/faker 5.5.9
   - @types/jest 27.0.2
   - @types/jsonwebtoken 8.5.5
   - @types/supertest 2.0.11
   - @types/swagger-ui-express 4.1.3
   - @typescript-eslint/eslint-plugin 4.29.3
   - @typescript-eslint/parser 4.29.3
   - babel-jest 27.3.1
   - babel-plugin-module-resolver 4.1.0
   - eslint 7.32.0
   - eslint-config-airbnb-typescript 14.0.1
   - eslint-config-prettier 8.3.0
   - eslint-plugin-import 2.22.1
   - eslint-plugin-node 11.1.0
   - eslint-plugin-prettier 4.0.0
   - eslint-plugin-promise 4.2.1
   - factory-girl 5.0.4
   - faker 5.5.3
   - jest 27.3.1
   - prettier 2.4.1
   - supertest 6.1.6
   - ts-jest 27.0.7
   - ts-node-dev 1.1.8
   - tsconfig-paths 3.11.0
   - typescript 4.4.0
## Example for .ENV and .ENV.TEST

Database name should be different for each

```
MONGO_HOST=127.0.0.1:27017
MONGO_USER=root
MONGO_PASSWORD=MongoDB2021
MONGO_COLLECTION=teste_compassolisa
PORT=3000
NODE_ENV=test
```

## Requirements

[Node.js](https://nodejs.org/en/)

[MongoDB](https://www.mongodb.com/pt-br)

## Instaling with npm

```
npm install
```

## Running Locally

```
# run test
npm run test

# run to build script
npm run build

# run server for production
npm run start

# run server for development
npm run dev
```

## Running with docker-compose

```
# build services
docker-compose up -d
```

if you are runnig locally it should be found on `localhost:3000`

## Routes

1. docs
   - http://localhost:3000/api/v1/api-docs
2. car
   - POST http://localhost:3000/api/v1/car
   - GET http://localhost:3000/api/v1/car
   - PUT http://localhost:3000/api/v1/car/:id
   - GET http://localhost:3000/api/v1/car/:id
   - DELETE http://localhost:3000/api/v1/car/:id
   - PATCH http://localhost:3000/api/v1/car/:id/acessorios/:id
3. people
   - POST http://localhost:3000/api/v1/people
   - GET http://localhost:3000/api/v1/people
   - PUT http://localhost:3000/api/v1/people/:id
   - GET http://localhost:3000/api/v1/people/:id
   - DELETE http://localhost:3000/api/v1/people/:id
4. authenticate
   - POST http://localhost:3000/api/v1/authenticate
5. rental
   - POST http://localhost:3000/api/v1/rental
   - GET http://localhost:3000/api/v1/rental
   - PUT http://localhost:3000/api/v1/rental/:id
   - GET http://localhost:3000/api/v1/rental/:id
   - DELETE http://localhost:3000/api/v1/rental/:id

## License

The [MIT License]() (MIT)

Copyright :copyright: 2021 - Projeto Final
