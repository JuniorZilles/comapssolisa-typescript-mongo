import AuthenticateController from '@controllers/AuthenticateController';
import { Router } from 'express';
import AuthenticateValidation from '@validations/authentication/authenticationValidation';

export default (prefix = '/authenticate'): Router => {
  const router = Router();
  router.post(`${prefix}/`, AuthenticateValidation, AuthenticateController.authenticate);
  return router;
};
