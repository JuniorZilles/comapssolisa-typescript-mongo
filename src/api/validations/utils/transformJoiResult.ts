import { ErrorPayload } from '@interfaces/ErrorPayload';
import Joi from 'joi';

const transformToArray = (value: Joi.ValidationError): ErrorPayload[] => {
  const result: ErrorPayload[] = value.details.map((detail: Joi.ValidationErrorItem) => {
    return { name: detail.message, description: detail.path.join('.') };
  });
  return result;
};

export default transformToArray;
