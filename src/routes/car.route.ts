
import CarController from "@controllers/CarController"
import { Router } from "express"
import { GetCarValidation } from "../../src/validations/car/getCarValidation"
import { UpdateCarValidation } from "../../src/validations/car/updateCarValidation"
import { CreateCarValidation } from "../../src/validations/car/createCarValidation"

export default (prefix = '/car'): Router => {
    const router = Router()
    router.post(`${prefix}/`, CreateCarValidation, CarController.create)
    router.get(`${prefix}/`, GetCarValidation, CarController.get)
    router.get(`${prefix}/:id`, CarController.getById)
    router.put(`${prefix}/:id`, UpdateCarValidation, CarController.update)
    router.delete(`${prefix}/:id`, CarController.delete)
    return router
}