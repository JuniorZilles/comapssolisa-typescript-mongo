/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import RentalService from '@services/RentalService';
import { NextFunction, Response, Request } from 'express';

class RentalController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const rental = await RentalService.create(req.body);
      return res.status(201).json(rental);
    } catch (e) {
      return next(e);
    }
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
