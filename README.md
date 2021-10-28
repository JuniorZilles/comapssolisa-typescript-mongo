# Projeto Final Parte 1

Development of the first stage of the API Compassolisa

## Summary 

[Example for .ENV and .ENV.TEST](#example-for-.env-and-.env.test)

[Instaling with npm](#instaling-with-npm)

[Running Locally](#running-locally)

[Running with docker-compose](#running-with-docker-compose)

[Routes](#routes)

[License](#license)

### Example for .ENV and .ENV.TEST

Database name should be different for each

~~~
MONGO_HOST=127.0.0.1:27017
MONGO_USER=root
MONGO_PASSWORD=MongoDB2021
MONGO_COLLECTION=teste_compassolisa
PORT=3000
NODE_ENV=test
~~~

### Requirements

[Node.js](https://nodejs.org/en/)

[MongoDB](https://www.mongodb.com/pt-br)

### Instaling with npm

~~~
npm install
~~~


### Running Locally

~~~
# run test
npm run test

# run to build script
npm run build

# run server for production
npm run start

# run server for development
npm run dev
~~~

### Running with docker-compose

~~~
# build services
docker-compose up -d
~~~

if you are runnig locally it should be found on `localhost:3000`

### Routes

1. car
    - POST http://localhost:3000/api/v1/car
    - GET http://localhost:3000/api/v1/car
    - PUT http://localhost:3000/api/v1/car/:id
    - GET http://localhost:3000/api/v1/car/:id
    - DELETE http://localhost:3000/api/v1/car/:id
2. people
    - POST http://localhost:3000/api/v1/people
    - GET http://localhost:3000/api/v1/people
    - PUT http://localhost:3000/api/v1/people/:id
    - GET http://localhost:3000/api/v1/people/:id
    - DELETE http://localhost:3000/api/v1/people/:id
3. authenticate
    - POST http://localhost:3000/api/v1/authenticate


## License 

The [MIT License]() (MIT)

Copyright :copyright: 2021 - Projeto Final Parte 1