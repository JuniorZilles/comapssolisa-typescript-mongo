
import AuthenticateController from "@controllers/AuthenticateController"
import { Router } from "express";

export default (prefix = '/authenticate'): Router => {
  const router = Router()
  router.post(`${prefix}/`, AuthenticateController.authenticate)
  return router
}