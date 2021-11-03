/* eslint-disable no-useless-escape */
import { NextFunction, Request, Response } from 'express';

import Extension from '@joi/date';
import Joi from 'joi';
import transformToArray from '@validations/utils/transformJoiResult';

const JoiDate = Joi.extend(Extension);

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = Joi.object({
      nome: Joi.string().trim(),
      cpf: Joi.string().trim().regex(/[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/).message('Invalid CPF'),
      data_nascimento: JoiDate.date().format('DD/MM/YYYY'),
      email: Joi.string().trim().email(),
      senha: Joi.string().trim().min(6),
      habilitado: Joi.string().trim().valid('sim', 'não'),
      limit: Joi.number(),
      offset: Joi.number(),
    });

    const { error } = schema.validate(req.query, { abortEarly: false });
    if (error) throw error;
    return next();
  } catch (error) {
    return res.status(400).json(transformToArray(error as Joi.ValidationError));
  }
};
