/* eslint-disable no-useless-escape */
import { NextFunction, Request, Response } from 'express';

import Extension from '@joi/date';
import Joi from 'joi';

const JoiDate = Joi.extend(Extension);

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = Joi.object({
      nome: Joi.string(),
      cpf: Joi.string().regex(/[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/),
      data_nascimento: JoiDate.date().format('DD/MM/YYYY'),
      email: Joi.string().email(),
      senha: Joi.string().min(6),
      habilitado: Joi.string().valid('sim', 'não'),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) throw error;
    return next();
  } catch (error) {
    return res.status(400).json(error);
  }
};
