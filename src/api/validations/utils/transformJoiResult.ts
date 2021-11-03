import { ErrorPayload } from '@interfaces/ErrorPayload';
import Joi from 'joi';

const transformToArray = (value: Joi.ValidationError): ErrorPayload[] => {
  const result: ErrorPayload[] = [];

  value.details.forEach((detail: Joi.ValidationErrorItem) => {
    const name = detail.message;
    const description = detail.path.join('.');
    result.push({ name, description });
  });
  return result;
};

export default transformToArray;
