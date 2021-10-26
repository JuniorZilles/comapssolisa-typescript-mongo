import { InvalidField } from "@errors/InvalidField"
import { InvalidValue } from "@errors/InvalidValue"
import { MissingBody } from "@errors/MissingBody"
import { NotFound } from "@errors/NotFound"
import { NextFunction, Request, Response } from "express"

export default (error:any, req:Request, res:Response, next:NextFunction) =>{
    let status = 500
    if (error instanceof NotFound || error instanceof InvalidField || error instanceof MissingBody || error instanceof InvalidValue){
        status = error.status
    }
    
    return res.status(status).json({ message: error.message })
}