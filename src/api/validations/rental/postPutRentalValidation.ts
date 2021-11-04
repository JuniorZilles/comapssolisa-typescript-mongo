/* eslint-disable no-useless-escape */
import { NextFunction, Request, Response } from 'express';

import Joi from 'joi';
import transformToArray from '@validations/utils/transformJoiResult';

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const schema = Joi.object({
      nome: Joi.string().trim().required(),
      cnpj: Joi.string()
        .trim()
        .regex(/[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}/)
        .message('"cnpj" has a invalid format')
        .required(),
      atividades: Joi.string().trim().required(),
      endereco: Joi.array()
        .min(1)
        .items(
          Joi.object({
            cep: Joi.string()
              .trim()
              .regex(/[0-9]{5}\-?[0-9]{3}/)
              .message('"cep" with incorrect format, it should be XXXXX-XXX')
              .required(),
            number: Joi.string().trim().required(),
            complemento: Joi.string().trim(),
            isFilial: Joi.boolean().valid(true, false).required(),
          })
        )
        .required(),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) throw error;
    return next();
  } catch (error) {
    return res.status(400).json(transformToArray(error as Joi.ValidationError));
  }
};
