import { NextFunction, Request, Response } from 'express';

import Joi from 'joi';
import Extension from '@joi/date';
import transformToArray from '@validations/utils/transformJoiResult';
import { idRegex, moneyRegex } from '@validations/utils/regex';

const JoiDate = Joi.extend(Extension);

export default async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const schema = Joi.object({
      id_user: Joi.string().length(24).trim().regex(idRegex).message('Invalid id_user'),
      id_carro: Joi.string().length(24).trim().regex(idRegex).message('Invalid id_carro'),
      valor_final: Joi.string().trim().regex(moneyRegex).message('Invalid valor_final'),
      data_inicio: JoiDate.date().format('DD/MM/YYYY'),
      data_fim: JoiDate.date().format('DD/MM/YYYY'),
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
