# Projeto Final

Development of the first stage of the API Compassolisa

<p align="center">
  <img src="http://img.shields.io/static/v1?label=License&message=MIT&color=green&style=for-the-badge"/>
  <img src="http://img.shields.io/static/v1?label=Node&message=14.18.1&color=green&style=for-the-badge&logo=node.js"/>
   <img src="http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=RED&style=for-the-badge"/>
</p>

## Summary 

[Example for .ENV and .ENV.TEST](#example-for-.env-and-.env.test)

[Instaling with npm](#instaling-with-npm)

[Running Locally](#running-locally)

[Running with docker-compose](#running-with-docker-compose)

[Routes](#routes)

[License](#license)

### :floppy_disk: RESOURCES

- Node.JS v.14.18.1
- MongoDB v.5.0.3
- Dependencies:
    - @joi/date v.2.1.0
    - bcryptjs v.2.4.3
    - Joi v17.4.2
    - dotenv v.10.0.0
    - express v.4.17.1
    - jsonwebtoken v.8.5.1
    - moment v.2.29.1
    - mongoose v.6.0.11
    - swagger-ui-express v.4.1.6

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

1. docs
    - http://localhost:3000/api/v1/api-docs
2. car
    - POST http://localhost:3000/api/v1/car
    - GET http://localhost:3000/api/v1/car
    - PUT http://localhost:3000/api/v1/car/:id
    - GET http://localhost:3000/api/v1/car/:id
    - DELETE http://localhost:3000/api/v1/car/:id
3. people
    - POST http://localhost:3000/api/v1/people
    - GET http://localhost:3000/api/v1/people
    - PUT http://localhost:3000/api/v1/people/:id
    - GET http://localhost:3000/api/v1/people/:id
    - DELETE http://localhost:3000/api/v1/people/:id
4. authenticate
    - POST http://localhost:3000/api/v1/authenticate


## License 

The [MIT License]() (MIT)

Copyright :copyright: 2021 - Projeto Final
