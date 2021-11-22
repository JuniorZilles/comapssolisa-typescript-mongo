import IdValidation from '@validations/rental/fleet/idFleetValidation';
import PostPutRentalCarValidation from '@validations/rental/fleet/postputFleetValidation';
import GetRentalCarValidation from '@validations/rental/fleet/getFleetValidation';
import { Router } from 'express';
import RentalFleetController from '@controllers/RentalFleetController';

export default (router: Router, prefix = '/fleet'): Router => {
  router.post(`${prefix}/`, PostPutRentalCarValidation, RentalFleetController.create);
  router.get(`${prefix}/`, GetRentalCarValidation, RentalFleetController.get);
  router.get(`${prefix}/:idFleet`, IdValidation, RentalFleetController.getById);
  router.put(`${prefix}/:idFleet`, IdValidation, PostPutRentalCarValidation, RentalFleetController.update);
  router.delete(`${prefix}/:idFleet`, IdValidation, RentalFleetController.delete);
  return router;
};
