import { paginateRental, serializeRental } from '@serialize/RentalSerialize';
import RentalService from '@services/rental';
import { NextFunction, Response, Request } from 'express';

class RentalController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const rental = await RentalService.create(req.body);
      return res.status(201).json(serializeRental(rental));
    } catch (e) {
      return next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const rental = await RentalService.update(req.params.id, req.body);
      return res.status(200).json(serializeRental(rental));
    } catch (e) {
      return next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await RentalService.delete(req.params.id);
      return res.status(204).end();
    } catch (e) {
      return next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const rental = await RentalService.getById(req.params.id);
      return res.status(200).json(serializeRental(rental));
    } catch (e) {
      return next(e);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const rentals = await RentalService.getAll(req.query);
      return res.status(200).json(paginateRental(rentals));
    } catch (e) {
      return next(e);
    }
  }
}

export default new RentalController();
