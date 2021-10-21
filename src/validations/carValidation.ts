import { NextFunction, Request, Response } from "express";

import Joi from 'joi';

export const CreateValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schema = Joi.object({
            modelo: Joi.string().required(),
            cor: Joi.string().required(),
            ano: Joi.number().required(),
            acessorios: Joi.array().items(
                Joi.object({
                    descricao: Joi.string().required()
                })
            ),
            quantidadePassageiros: Joi.number().required()
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
            modelo: Joi.string(),
            cor: Joi.string(),
            ano: Joi.number(),
            acessorios: Joi.array().items(
                Joi.object({
                    descricao: Joi.string().required()
                })
            ).has(Joi.object({ descricao: Joi.string().valid('descricao')})),
            quantidadePassageiros: Joi.number()
        });

        const { error } = schema.validate(req.body, { abortEarly: true });
        if (error) throw error
        return next();
    } catch (error) {
        return res.status(400).json(error);
    }
}