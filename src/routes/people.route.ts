
import PeopleController from "@controllers/PeopleController"
import { Router } from "express";

export default (prefix = '/people'): Router => {
  const router = Router()
  router.post(`${prefix}/`, PeopleController.create)
  return router
}