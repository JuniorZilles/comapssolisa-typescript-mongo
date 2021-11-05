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

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const rental = await RentalService.update(req.params.id, req.body);
      return res.status(200).json(rental);
    } catch (e) {
      return next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const removed = await RentalService.delete(req.params.id);
      if (removed) {
        return res.status(204).end();
      }
      return res
        .status(400)
        .send([{ description: 'Bad Request', name: 'Something went wrong!' }]);
    } catch (e) {
      return next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const rental = await RentalService.getById(req.params.id);
      if (rental) {
        return res.status(200).json(rental);
      }
      return res
        .status(400)
        .send([{ description: 'Bad Request', name: 'Something went wrong!' }]);
    } catch (e) {
      return next(e);
    }
  }

  getAll(req: Request, res: Response, next: NextFunction) {
    return res.json('Rental getall');
  }
}

export default new RentalController();
