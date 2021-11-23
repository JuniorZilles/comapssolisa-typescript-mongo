import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

import routerPeople from './people.route';
import routerRental from './rental.route';
import routerCar from './car.route';
import routerAuthenticate from './authenticate.route';
import swaggerFile from '../static/swagger_layout.json';

const V1Prefix = '/api/v1';

export default (server: Express): void => {
  server.use(`${V1Prefix}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerFile));
  server.use(V1Prefix, routerPeople());
  server.use(V1Prefix, routerAuthenticate());
  server.use(V1Prefix, routerRental());
  server.use(V1Prefix, routerCar());
};
