import { paginateRentalCar, serializeRentalCar } from '@serialize/RentalFleetSerialize';
import RentalFleetService from '@services/rental/fleet';
import { Request, Response, NextFunction } from 'express';

class RentalFleetController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await RentalFleetService.create(id, req.body);
      return res.status(201).json(serializeRentalCar(result));
    } catch (e) {
      return next(e);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await RentalFleetService.getAll(id, req.query);
      return res.status(200).json(paginateRentalCar(result));
    } catch (e) {
      return next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, idFleet } = req.params;
      const result = await RentalFleetService.getById(id, idFleet);
      return res.status(200).json(serializeRentalCar(result));
    } catch (e) {
      return next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, idFleet } = req.params;
      const result = await RentalFleetService.update(id, idFleet, req.body);
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
      const { id, idFleet } = req.params;
      const removed = await RentalFleetService.delete(id, idFleet);
      if (removed) {
        return res.status(204).end();
      }
      return res.status(400).send([{ description: 'Bad Request', name: 'Something went wrong!' }]);
    } catch (e) {
      return next(e);
    }
  }
}

export default new RentalFleetController();
