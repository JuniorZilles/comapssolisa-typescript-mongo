import { NextFunction, Request, Response } from 'express';

import Joi from 'joi';
import transformToArray from '@validations/utils/transformJoiResult';
import { idRegex } from '@validations/utils/regex';

export default async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const schema = Joi.object({
      id_carro: Joi.string().length(24).trim().regex(idRegex).message('Invalid id_carro'),
      status: Joi.string().trim().valid('disponível', 'indisponível'),
      valor_diaria: Joi.number(),
      placa: Joi.string().trim(),
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
