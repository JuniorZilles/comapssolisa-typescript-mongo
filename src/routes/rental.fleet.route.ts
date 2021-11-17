import { Router } from 'express';
import IdValidation from '@validations/rental/fleet/idFleetValidation';
import PostPutRentalFleetValidation from '@validations/rental/fleet/postputRentalFleetValidation';
import GetRentalFleetValidation from '@validations/rental/fleet/getRentalFleetValidation';
import RentalFleetController from '@controllers/RentalFleetController';

export default (router: Router, prefix = '/fleet'): Router => {
  router.post(`${prefix}/`, PostPutRentalFleetValidation, RentalFleetController.create);
  router.get(`${prefix}/`, GetRentalFleetValidation, RentalFleetController.get);
  router.get(`${prefix}/:idFleet`, IdValidation, RentalFleetController.getById);
  router.put(`${prefix}/:idFleet`, IdValidation, PostPutRentalFleetValidation, RentalFleetController.update);
  router.delete(`${prefix}/:idFleet`, IdValidation, RentalFleetController.delete);
  return router;
};
