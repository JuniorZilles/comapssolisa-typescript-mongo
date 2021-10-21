
import PeopleController from "@controllers/PeopleController"
import { Router } from "express"
import { CreateValidation, UpdateValidation, GetValidation } from "../../src/validations/peopleValidation"

export default (prefix = '/people'): Router => {
  const router = Router()
  router.post(`${prefix}/`, CreateValidation, PeopleController.create)
  router.get(`${prefix}/`, GetValidation, PeopleController.get)
  router.get(`${prefix}/:id`, PeopleController.getById)
  router.put(`${prefix}/:id`, UpdateValidation, PeopleController.update)
  router.delete(`${prefix}/:id`, PeopleController.delete)
  return router
}