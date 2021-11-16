/* eslint-disable no-useless-escape */
import { NextFunction, Request, Response } from 'express';

import Joi from 'joi';
import transformToArray from '@validations/utils/transformJoiResult';
import { cnpjRegex, cepRegex } from '@validations/utils/regex';

export default async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const schema = Joi.object({
      nome: Joi.string().trim().required(),
      cnpj: Joi.string()
        .trim()
        .regex(cnpjRegex)
        .message('"cnpj" has a invalid format, it should be XX.XXX.XXX/XXXX-XX')
        .required(),
      atividades: Joi.string().trim().required(),
      endereco: Joi.array()
        .min(1)
        .items(
          Joi.object({
            cep: Joi.string()
              .trim()
              .regex(cepRegex)
              .message('"cep" with incorrect format, it should be XXXXX-XXX')
              .required(),
            number: Joi.string().trim().required(),
            complemento: Joi.string().trim(),
            isFilial: Joi.boolean().required()
          })
        )
        .required()
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) throw error;
    return next();
  } catch (error) {
    return res.status(400).json(transformToArray(error as Joi.ValidationError));
  }
};
