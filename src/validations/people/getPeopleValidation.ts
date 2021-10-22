import { NextFunction, Request, Response } from "express";

import Joi from 'joi';

export const GetPeopleValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schema = Joi.object({
            nome: Joi.string(),
            cpf: Joi.string().regex(/[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/),
            data_nascimento: Joi.date(),
            email: Joi.string().email(),
            senha: Joi.string().min(6),
            habilitado:Joi.string().valid('sim', 'não'),
            size: Joi.number(),
            start: Joi.number()
        });

        const { error } = schema.validate(req.body, { abortEarly: true });
        if (error) throw error
        return next();
    } catch (error) {
        return res.status(400).json(error);
    }
}