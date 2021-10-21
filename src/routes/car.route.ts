
import CarController from "@controllers/CarController"
import { Router } from "express"
import { CreateValidation, UpdateValidation, GetValidation } from "../../src/validations/carValidation"

export default (prefix = '/car'): Router => {
    const router = Router()
    router.post(`${prefix}/`, CreateValidation, CarController.create)
    router.get(`${prefix}/`, GetValidation, CarController.get)
    router.get(`${prefix}/:id`, CarController.getById)
    router.put(`${prefix}/:id`, UpdateValidation, CarController.update)
    router.delete(`${prefix}/:id`, CarController.delete)
    return router
}