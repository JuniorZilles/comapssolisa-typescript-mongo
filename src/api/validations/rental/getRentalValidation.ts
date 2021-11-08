/* eslint-disable no-useless-escape */
import { NextFunction, Request, Response } from 'express';

import Joi from 'joi';
import transformToArray from '@validations/utils/transformJoiResult';

export default async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const schema = Joi.object({
      nome: Joi.string().trim(),
      cnpj: Joi.string()
        .trim()
        .regex(/\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}/)
        .message('"cnpj" has a invalid format'),
      atividades: Joi.string().trim(),
      cep: Joi.string()
        .trim()
        .regex(/\d{5}-\d{3}/)
        .message('"cep" with incorrect format, it should be XXXXX-XXX'),
      number: Joi.string().trim(),
      complemento: Joi.string().trim(),
      logradouro: Joi.string().trim(),
      bairro: Joi.string().trim(),
      localidade: Joi.string().trim(),
      uf: Joi.string().trim().length(2),
      isFilial: Joi.boolean().valid(true, false),
      limit: Joi.number(),
      offset: Joi.number()
    });

    const { error } = schema.validate(req.query, { abortEarly: false });
    if (error) throw error;
    return next();
  } catch (error) {
    return res.status(400).json(transformToArray(error as Joi.ValidationError));
  }
};
