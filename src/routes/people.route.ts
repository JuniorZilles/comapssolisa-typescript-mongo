
import PeopleController from "@controllers/PeopleController"
import { Router } from "express";

export default (prefix = '/people'): Router => {
  const router = Router()
  router.post(`${prefix}/`, PeopleController.create)
  router.get(`${prefix}/`, PeopleController.get)
  router.get(`${prefix}/:id`, PeopleController.getById)
  router.put(`${prefix}/:id`,PeopleController.update)
  router.delete(`${prefix}/:id`, PeopleController.delete)
  return router
}