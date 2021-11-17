import { NextFunction, Request, Response } from 'express';

import Joi from 'joi';
import transformToArray from '@validations/utils/transformJoiResult';
import { cnpjRegex, cepRegex } from '@validations/utils/regex';

export default async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const schema = Joi.object({
      nome: Joi.string().trim(),
      cnpj: Joi.string()
        .trim()
        .regex(cnpjRegex)
        .message('"cnpj" has a invalid format, it should be XX.XXX.XXX/XXXX-XX'),
      atividades: Joi.string().trim(),
      cep: Joi.string().trim().regex(cepRegex).message('"cep" with incorrect format, it should be XXXXX-XXX'),
      number: Joi.string().trim(),
      complemento: Joi.string().trim(),
      logradouro: Joi.string().trim(),
      bairro: Joi.string().trim(),
      localidade: Joi.string().trim(),
      uf: Joi.string().trim().length(2),
      isFilial: Joi.boolean(),
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
