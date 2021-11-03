import TokenPayload from '@interfaces/TokenPayload';
import { verifyToken } from '@services/TokenService';
import { NextFunction, Request, Response } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json([{ description: 'Bearer', name: 'Token not provided' }]);
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res
      .status(401)
      .json([{ description: 'Bearer', name: 'Token error' }]);
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res
      .status(401)
      .json([{ description: 'Bearer', name: 'Token malformatted' }]);
  }
  try {
    const result = verifyToken(token);
    const content = result as TokenPayload;

    req.userId = content.content.id;
    req.habilitado = content.content.habilitado;
    req.email = content.content.email;
    return next();
  } catch (error) {
    return res
      .status(401)
      .json([{ description: 'Bearer', name: 'Token invalid' }]);
  }
};
