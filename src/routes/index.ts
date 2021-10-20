import { Express } from 'express'
import routerPeople from './people.route'
import routerCar from './car.route'
import routerAuthenticate from './authenticate.route'

const V1Prefix = '/api/v1'

export default (server:Express):void => {
    server.use(V1Prefix, routerPeople())
    server.use(V1Prefix, routerCar())
    server.use(V1Prefix, routerAuthenticate())
}
