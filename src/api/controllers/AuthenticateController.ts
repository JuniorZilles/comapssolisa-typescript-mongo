import {Request, Response } from "express"
class AuthenticateController{

    async authenticate(req:Request, res:Response) {
        return res.status(200).send('ok')
    }
}

export default new AuthenticateController()