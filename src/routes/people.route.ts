
import PeopleController from "@controllers/PeopleController"
import { Router } from "express"
import { CreatePeopleValidation } from "src/validations/people/createPeopleValidation"
import { GetPeopleValidation } from "src/validations/people/getPeopleValidation"
import { UpdatePeopleValidation } from "src/validations/people/updatePeopleValidation"


export default (prefix = '/people'): Router => {
  const router = Router()
  router.post(`${prefix}/`, CreatePeopleValidation, PeopleController.create)
  router.get(`${prefix}/`, GetPeopleValidation, PeopleController.get)
  router.get(`${prefix}/:id`, PeopleController.getById)
  router.put(`${prefix}/:id`, UpdatePeopleValidation, PeopleController.update)
  router.delete(`${prefix}/:id`, PeopleController.delete)
  return router
}