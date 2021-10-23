import { Express } from 'express'
import routerPeople from './people.route'
import routerCar from './car.route'
import routerAuthenticate from './authenticate.route'
import swaggerUi from 'swagger-ui-express'
import swaggerFile from '../static/swagger_layout.json'

const V1Prefix = '/api/v1'

export default (server:Express):void => {
    server.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
    server.use(V1Prefix, routerPeople())
    server.use(V1Prefix, routerCar())
    server.use(V1Prefix, routerAuthenticate())
}
