/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Response, Request } from 'express';

class RentalController {
  create(req: Request, res: Response, next: NextFunction) {
    return res.json('Rental create');
  }

  update(req: Request, res: Response, next: NextFunction) {
    return res.json('Rental update');
  }

  delete(req: Request, res: Response, next: NextFunction) {
    return res.json('Rental delete');
  }

  getById(req: Request, res: Response, next: NextFunction) {
    return res.json('Rental getbyd');
  }

  getAll(req: Request, res: Response, next: NextFunction) {
    return res.json('Rental getall');
  }
}

export default new RentalController();
