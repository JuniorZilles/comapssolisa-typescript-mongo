import { NextFunction, Request, Response } from 'express';

import Joi from 'joi';
import transformToArray from '@validations/utils/transformJoiResult';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = Joi.object({
      id: Joi.string().length(24).trim().regex(/[0-9A-Fa-f]{24}/)
        .message('Invalid Id')
        .required(),
      idAcessorio: Joi.string().length(24).trim().regex(/[0-9A-Fa-f]{24}/)
        .message('Invalid idAcessorio')
        .required(),
    });

    const { error } = schema.validate(req.params, { abortEarly: false });
    if (error) throw error;
    return next();
  } catch (error) {
    return res.status(400).json(transformToArray(error as Joi.ValidationError));
  }
};
