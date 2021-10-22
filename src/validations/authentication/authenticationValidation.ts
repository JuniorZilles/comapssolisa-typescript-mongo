import { NextFunction, Request, Response } from "express";

import Joi from 'joi';

export const AuthenticateValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            senha: Joi.string().min(6).required(),
        });

        const { error } = schema.validate(req.body, { abortEarly: true });
        if (error) throw error
        return next();
    } catch (error) {
        return res.status(400).json(error);
    }
}