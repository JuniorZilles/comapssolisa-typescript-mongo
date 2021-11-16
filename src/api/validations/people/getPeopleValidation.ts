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
      nome: Joi.string().trim(),
      cpf: Joi.string().trim().regex(cpfRegex).message('"cpf" has a invalid format, it should be XXX.XXX.XXX-XX'),
      data_nascimento: JoiDate.date().format('DD/MM/YYYY'),
      email: Joi.string().trim().email(),
      habilitado: Joi.string().trim().valid('sim', 'não'),
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
