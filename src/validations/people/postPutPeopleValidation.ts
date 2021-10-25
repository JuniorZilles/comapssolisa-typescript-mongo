import { NextFunction, Request, Response } from "express";

import Joi from 'joi';

export const PostPutPeopleValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schema = Joi.object({
            nome: Joi.string().required(),
            cpf: Joi.string().regex(/[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/).required(),
            data_nascimento: Joi.date().required(),
            email: Joi.string().email().required(),
            senha: Joi.string().min(6).required(),
            habilitado:Joi.string().valid('sim', 'não').required()
        });

        const { error } = schema.validate(req.body, { abortEarly: true });
        if (error) throw error
        return next();
    } catch (error) {
        return res.status(400).json(error);
    }
}