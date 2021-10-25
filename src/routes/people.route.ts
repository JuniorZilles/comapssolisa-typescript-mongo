
import PeopleController from "@controllers/PeopleController"
import { Router } from "express"
import { PostPutPeopleValidation } from "../validations/people/postPutPeopleValidation"
import { GetPeopleValidation } from "../validations/people/getPeopleValidation"


export default (prefix = '/people'): Router => {
  const router = Router()
  router.post(`${prefix}/`, PostPutPeopleValidation, PeopleController.create)
  router.get(`${prefix}/`, GetPeopleValidation, PeopleController.get)
  router.get(`${prefix}/:id`, PeopleController.getById)
  router.put(`${prefix}/:id`, PostPutPeopleValidation, PeopleController.update)
  router.delete(`${prefix}/:id`, PeopleController.delete)
  return router
}