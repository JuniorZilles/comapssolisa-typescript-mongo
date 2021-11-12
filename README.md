# Projeto Final

Development of the first stage of the API Compassolisa

[![Deploy](https://github.com/JuniorZilles/projeto_final/actions/workflows/main.yml/badge.svg)](https://github.com/JuniorZilles/projeto_final/actions/workflows/main.yml)
[![GitHub issues](https://img.shields.io/github/issues/JuniorZilles/projeto_final.svg)](https://GitHub.com/JuniorZilles/projeto_final/issues/)
[![GitHub pull-requests](https://img.shields.io/github/issues-pr/JuniorZilles/projeto_final.svg)](https://GitHub.com/JuniorZilles/projeto_final/pull/)
[![GitHub contributors](https://img.shields.io/github/contributors/JuniorZilles/projeto_final.svg)](https://GitHub.com/JuniorZilles/projeto_final/graphs/contributors/)
[![GitHub forks](https://img.shields.io/github/forks/JuniorZilles/projeto_final.svg?style=social&label=Fork&maxAge=2592000)](https://GitHub.com/JuniorZilles/projeto_final/network/)
[![GitHub followers](https://img.shields.io/github/followers/JuniorZilles.svg?style=social&label=Follow&maxAge=2592000)](https://github.com/JuniorZilles?tab=followers)

<p align="center">
   <img src="http://img.shields.io/static/v1?label=License&message=MIT&color=red&style=for-the-badge"/>
   <img src="http://img.shields.io/static/v1?label=Node&message=14.18.1&color=green&style=for-the-badge&logo=node.js"/>
   <img src="http://img.shields.io/static/v1?label=MongoDB&message=5.0.3&color=green&style=for-the-badge&logo=mongodb"/>
   <img src="http://img.shields.io/static/v1?label=Typescript&message=4.4.4&color=blue&style=for-the-badge&logo=typescript"/>
   <img src="http://img.shields.io/static/v1?label=express&message=4.17.1&color=blue&style=for-the-badge&logo=express"/>
   <img src="http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=yellow&style=for-the-badge"/>
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
  - mongoose-paginate-v2 v.1.4.2
  - swagger-ui-express v.4.1.6
- Development dependencies:
  - @babel/cli v.7.15.7
  - @babel/core v.7.15.8
  - @babel/preset-env v.7.15.8
  - @babel/preset-typescript v.7.15.0
  - @types/bcryptjs v.2.4.2
  - @types/express v.4.17.13
  - @types/factory-girl v.5.0.8
  - @types/faker v.5.5.9
  - @types/jest v.27.0.2
  - @types/jsonwebtoken v.8.5.5
  - @types/supertest v.2.0.11
  - @types/swagger-ui-express v.4.1.3
  - @types/mongoose-paginate-v2 v.1.4.0
  - @typescript-eslint/eslint-plugin v.4.29.3
  - @typescript-eslint/parser v.4.29.3
  - babel-jest v.27.3.1
  - babel-plugin-module-resolver v.4.1.0
  - eslint v.7.32.0
  - eslint-config-airbnb-typescript v.14.0.1
  - eslint-config-prettier v.8.3.0
  - eslint-plugin-import v.2.22.1
  - eslint-plugin-node v.11.1.0
  - eslint-plugin-prettier v.4.0.0
  - eslint-plugin-promise v.4.2.1
  - factory-girl v.5.0.4
  - faker v.5.5.3
  - jest v.27.3.1
  - prettier v.2.4.1
  - supertest v.6.1.6
  - ts-jest v.27.0.7
  - ts-node-dev v.1.1.8
  - tsconfig-paths v.3.11.0
  - typescript v.4.4.4

## Example for .ENV and .ENV.TEST

Database name should be different for each

```
MONGO_HOST=mongodb://mongodb://root:MongoDB2021@mongo-svc:27017/
MONGO_DB_NAME=compassolisa
PORT=3000
NODE_ENV=dev
SECRET=bab2ada84cd5dd8f0185e6d673e3800f
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

# run tests with coverage
npm run coverage

# run to build script
npm run build

# run server for production
npm run start

# run server for development
npm run dev

# run eslint verification with auto fix
npm run lint-fix
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
