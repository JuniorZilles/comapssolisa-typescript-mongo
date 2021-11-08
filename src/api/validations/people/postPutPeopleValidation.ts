/* eslint-disable no-useless-escape */
import { NextFunction, Request, Response } from 'express';

import Extension from '@joi/date';
import Joi from 'joi';
import transformToArray from '@validations/utils/transformJoiResult';
import { cpfRegex } from '@validations/utils/regex';

const JoiDate = Joi.extend(Extension);

export default async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const schema = Joi.object({
      nome: Joi.string().trim().required(),
      cpf: Joi.string().trim().regex(cpfRegex).message('Invalid CPF').required(),
      data_nascimento: JoiDate.date().format('DD/MM/YYYY').required(),
      email: Joi.string().trim().email().required(),
      senha: Joi.string().trim().min(6).required(),
      habilitado: Joi.string().trim().valid('sim', 'não').required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) throw error;
    return next();
  } catch (error) {
    return res.status(400).json(transformToArray(error as Joi.ValidationError));
  }
};
