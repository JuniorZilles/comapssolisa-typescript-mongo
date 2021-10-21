import { NextFunction, Request, Response } from "express";

import Joi from 'joi';

export const CreateValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schema = Joi.object({
            nome: Joi.string().required(),
            cpf: Joi.string().required(),
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

export const UpdateValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schema = Joi.object({
            nome: Joi.string(),
            cpf: Joi.string(),
            data_nascimento: Joi.date(),
            email: Joi.string().email(),
            senha: Joi.string().min(6),
            habilitado:Joi.string().valid('sim', 'não')
        });

        const { error } = schema.validate(req.body, { abortEarly: true });
        if (error) throw error
        return next();
    } catch (error) {
        return res.status(400).json(error);
    }
}

export const GetValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schema = Joi.object({
            nome: Joi.string(),
            cpf: Joi.string(),
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