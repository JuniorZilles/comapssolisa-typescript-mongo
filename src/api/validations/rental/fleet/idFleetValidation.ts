import { NextFunction, Request, Response } from 'express';

import Joi from 'joi';
import { idRegex } from '@validations/utils/regex';
import transformToArray from '../../utils/transformJoiResult';

export default async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const schema = Joi.object({
      id: Joi.string().length(24).trim().regex(idRegex).message('Invalid Id').required(),
      idFleet: Joi.string().length(24).trim().regex(idRegex).message('Invalid idFleet').required()
    });

    const { error } = schema.validate(req.params, { abortEarly: false });
    if (error) throw error;
    return next();
  } catch (error) {
    return res.status(400).json(transformToArray(error as Joi.ValidationError));
  }
};
