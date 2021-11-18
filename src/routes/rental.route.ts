import RentalController from '@controllers/RentalController';
import { Router } from 'express';
import PostPutRentalValidation from '@validations/rental/postPutRentalValidation';
import GetRentalValidation from '@validations/rental/getRentalValidation';
import IdValidation from '@validations/idValidation';
import rentalFleet from './rental.fleet.route';
import rentalReserve from './rental.reserve.route';

export default (prefix = '/rental'): Router => {
  const router = Router();
  router.post(`${prefix}/`, PostPutRentalValidation, RentalController.create);
  router.get(`${prefix}/`, GetRentalValidation, RentalController.getAll);
  router.get(`${prefix}/:id`, IdValidation, RentalController.getById);
  router.put(`${prefix}/:id`, IdValidation, PostPutRentalValidation, RentalController.update);
  router.delete(`${prefix}/:id`, IdValidation, RentalController.delete);
  router.use(`${prefix}/:id`, IdValidation, rentalFleet(router));
  router.use(`${prefix}/:id`, IdValidation, rentalReserve(router));
  return router;
};
