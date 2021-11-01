import CarController from '@controllers/CarController';
import { Router } from 'express';
import GetCarValidation from '@validations/car/getCarValidation';
import PostPutCarValidation from '@validations/car/postPutCarValidation';
import IdValidation from '@validations/idValidation';

export default (prefix = '/car'): Router => {
  const router = Router();
  router.post(`${prefix}/`, PostPutCarValidation, CarController.create);
  router.get(`${prefix}/`, GetCarValidation, CarController.get);
  router.get(`${prefix}/:id`, IdValidation, CarController.getById);
  router.put(`${prefix}/:id`, IdValidation, PostPutCarValidation, CarController.update);
  router.delete(`${prefix}/:id`, IdValidation, CarController.delete);
  return router;
};
