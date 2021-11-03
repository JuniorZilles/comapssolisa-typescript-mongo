import { NextFunction, Request, Response } from 'express';

import Joi from 'joi';
import transformToArray from '@validations/utils/transformJoiResult';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = Joi.object({
      descricao: Joi.string().trim().required(),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) throw error;
    return next();
  } catch (error) {
    return res.status(400).json(transformToArray(error as Joi.ValidationError));
  }
};
