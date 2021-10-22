import { NextFunction, Request, Response } from "express";

import Joi from 'joi';

export const CreateValidation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const schema = Joi.object({
            modelo: Joi.string().required(),
            cor: Joi.string().required(),
            ano: Joi.number().min(1950).max(2022).required(),
            acessorios: Joi.array().min(1).items(
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