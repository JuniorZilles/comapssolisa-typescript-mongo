import CarController from '@controllers/CarController';
import { Router } from 'express';
import GetCarValidation from '../validations/car/getCarValidation';
import PostPutCarValidation from '../validations/car/postPutCarValidation';

export default (prefix = '/car'): Router => {
  const router = Router();
  router.post(`${prefix}/`, PostPutCarValidation, CarController.create);
  router.get(`${prefix}/`, GetCarValidation, CarController.get);
  router.get(`${prefix}/:id`, CarController.getById);
  router.put(`${prefix}/:id`, PostPutCarValidation, CarController.update);
  router.delete(`${prefix}/:id`, CarController.delete);
  return router;
};
