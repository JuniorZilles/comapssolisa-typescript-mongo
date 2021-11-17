import { Router } from 'express';
import IdValidation from '@validations/rental/reserve/idReserveValidation';
import PostPutRentalReserveValidation from '@validations/rental/reserve/postputRentalReserveValidation';
import GetRentalReserveValidation from '@validations/rental/reserve/getRentalReserveValidation';
import RentalReserveController from '@controllers/RentalReserveController';

export default (router: Router, prefix = '/fleet'): Router => {
  router.post(`${prefix}/`, PostPutRentalReserveValidation, RentalReserveController.create);
  router.get(`${prefix}/`, GetRentalReserveValidation, RentalReserveController.get);
  router.get(`${prefix}/:idReserve`, IdValidation, RentalReserveController.getById);
  router.put(`${prefix}/:idReserve`, IdValidation, PostPutRentalReserveValidation, RentalReserveController.update);
  router.delete(`${prefix}/:idReserve`, IdValidation, RentalReserveController.delete);
  return router;
};
