
import CarController from "@controllers/CarController"
import { Router } from "express";

export default (prefix = '/car'): Router => {
    const router = Router()
    router.post(`${prefix}/`, CarController.create)
    return router
}