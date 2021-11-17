import IdValidation from '@validations/rental/car/idCarValidation';
import PostPutRentalCarValidation from '@validations/rental/car/postputRentalCarValidation';
import GetRentalCarValidation from '@validations/rental/car/getRentalCarValidation';
import { Router } from 'express';
import RentalCarController from '@controllers/RentalCarController';

export default (router: Router, prefix = '/car'): Router => {
  router.post(`${prefix}/`, PostPutRentalCarValidation, RentalCarController.create);
  router.get(`${prefix}/`, GetRentalCarValidation, RentalCarController.get);
  router.get(`${prefix}/:idCar`, IdValidation, RentalCarController.getById);
  router.put(`${prefix}/:idCar`, IdValidation, PostPutRentalCarValidation, RentalCarController.update);
  router.delete(`${prefix}/:idCar`, IdValidation, RentalCarController.delete);
  return router;
};
