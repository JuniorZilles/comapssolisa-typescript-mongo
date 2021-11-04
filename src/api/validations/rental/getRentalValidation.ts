/* eslint-disable no-useless-escape */
import { NextFunction, Request, Response } from 'express';

import Joi from 'joi';
import transformToArray from '@validations/utils/transformJoiResult';

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const schema = Joi.object({});

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) throw error;
    return next();
  } catch (error) {
    return res.status(400).json(transformToArray(error as Joi.ValidationError));
  }
};
