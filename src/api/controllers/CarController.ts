import { CarSearch } from "@models/CarSearchModel"
import CarService from "@services/CarService"
import {Request, Response, NextFunction } from "express"
class CarController{

    async create(req:Request, res:Response, next: NextFunction) {
        try{
            const car = await CarService.create(req.body)
            return res.status(201).json(car)
        }
        catch(e){
            next(e)
        }
    }

    async get(req:Request, res:Response, next: NextFunction) {
        try{
            const cars = await CarService.list(req.query as CarSearch)
            return res.status(200).json(cars)
        }
        catch(e){
            next(e)
        }
    }

    async getById(req:Request, res:Response, next: NextFunction) {
        try{
            const id = req.params.id
            const car = await CarService.getById(id)
            return res.status(200).json(car)
        }
        catch(e){
            next(e)
        }
    }

    async update(req:Request, res:Response, next: NextFunction) {
        try{
            const id = req.params.id
            const updated = await CarService.update(id, req.body)
            if(updated){
                return res.status(204).end()
            }else{
                return res.status(400).send({message:"Something went wrong!"})
            }
        }
        catch(e){
            next(e)
        }
    }

    async delete(req:Request, res:Response, next: NextFunction) {
        try{
            const id = req.params.id
            const removed = await CarService.delete(id)
            if(removed){
                return res.status(204).end()
            }else{
                return res.status(400).send({message:"Something went wrong!"})
            }
        }
        catch(e){
            next(e)
        }
    }
}

export default new CarController()