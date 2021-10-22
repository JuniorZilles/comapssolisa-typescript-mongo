import PeopleService from "@services/PeopleService"
import {Request, Response, NextFunction } from "express"
class PeopleController{

    async create(req:Request, res:Response, next: NextFunction) {
        try{
            const people = await PeopleService.create(req.body)
            return res.status(201).json(people)
        }
        catch(e){
            next(e)
        }
    }

    async get(req:Request, res:Response, next: NextFunction) {
        try{
            const people = await PeopleService.list(req.query)
            return res.status(200).json(people)
        }
        catch(e){
            next(e)
        }
    }

    async getById(req:Request, res:Response, next: NextFunction) {
        try{
            const people = await PeopleService.getById(req.params.id)
            return res.status(200).json(people)
        }
        catch(e){
            next(e)
        }
    }

    async update(req:Request, res:Response, next: NextFunction) {
        try{
            return res.status(204).end()
        }
        catch(e){
            next(e)
        }
    }

    async delete(req:Request, res:Response, next: NextFunction) {
        try{
            return res.status(204).end()
        }
        catch(e){
            next(e)
        }
    }
}

export default new PeopleController()