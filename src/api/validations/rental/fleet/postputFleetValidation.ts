import { NextFunction, Request, Response } from 'express';

import Joi from 'joi';
import transformToArray from '@validations/utils/transformJoiResult';
import { idRegex } from '@validations/utils/regex';

export default async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const schema = Joi.object({
      id_carro: Joi.string().length(24).trim().regex(idRegex).message('Invalid id_carro').required(),
      status: Joi.string().trim().valid('disponível', 'indisponível').required(),
      valor_diaria: Joi.number().required(),
      placa: Joi.string().trim().required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) throw error;
    return next();
  } catch (error) {
    return res.status(400).json(transformToArray(error as Joi.ValidationError));
  }
};
