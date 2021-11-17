import { paginateRentalCar, serializeRentalCar } from '@serialize/RentalCarSerialize';
import RentalCarService from '@services/rental/car/RentalCarService';
import { Request, Response, NextFunction } from 'express';

class RentalCarController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await RentalCarService.create(req.body);
      return res.status(201).json(serializeRentalCar(result));
    } catch (e) {
      return next(e);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await RentalCarService.getAll(req.query);
      return res.status(200).json(paginateRentalCar(result));
    } catch (e) {
      return next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await RentalCarService.getById(id);
      return res.status(200).json(serializeRentalCar(result));
    } catch (e) {
      return next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await RentalCarService.update(req.body, id);
      if (result) {
        return res.status(200).json(serializeRentalCar(result));
      }
      return res.status(400).send([{ description: 'Bad Request', name: 'Something went wrong!' }]);
    } catch (e) {
      return next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const removed = await RentalCarService.delete(id);
      if (removed) {
        return res.status(204).end();
      }
      return res.status(400).send([{ description: 'Bad Request', name: 'Something went wrong!' }]);
    } catch (e) {
      return next(e);
    }
  }
}

export default new RentalCarController();
