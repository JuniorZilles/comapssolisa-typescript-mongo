
import CarController from "@controllers/CarController"
import { Router } from "express";

export default (prefix = '/car'): Router => {
    const router = Router()
    router.post(`${prefix}/`, CarController.create)
    router.get(`${prefix}/`, CarController.get)
    router.get(`${prefix}/:id`, CarController.getById)
    router.put(`${prefix}/:id`, CarController.update)
    router.delete(`${prefix}/:id`, CarController.delete)
    return router
}