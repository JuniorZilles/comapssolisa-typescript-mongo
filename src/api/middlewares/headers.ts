/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { NextFunction, Request, Response } from 'express';

export default (error: Error, req: Request, res: Response, next: NextFunction) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
};
