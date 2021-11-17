import { NextFunction, Request, Response } from 'express';

import Joi from 'joi';
import Extension from '@joi/date';
import transformToArray from '@validations/utils/transformJoiResult';
import { idRegex } from '@validations/utils/regex';

const JoiDate = Joi.extend(Extension);

export default async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const schema = Joi.object({
      id_user: Joi.string().length(24).trim().regex(idRegex).message('Invalid id_user'),
      id_carro: Joi.string().length(24).trim().regex(idRegex).message('Invalid id_carro'),
      id_locadora: Joi.string().length(24).trim().regex(idRegex).message('Invalid id_locadora'),
      valor_final: Joi.number(),
      data_inicio: JoiDate.date().format('DD/MM/YYYY'),
      data_fim: JoiDate.date().format('DD/MM/YYYY')
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) throw error;
    return next();
  } catch (error) {
    return res.status(400).json(transformToArray(error as Joi.ValidationError));
  }
};
