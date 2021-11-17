import { paginateRentalFleet, serializeRentalFleet } from '@serialize/RentalFleetSerialize';
import RentalFleetService from '@services/rental/fleet/RentalFleetService';
import { Request, Response, NextFunction } from 'express';

class RentalFleetController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await RentalFleetService.create(req.body);
      return res.status(201).json(serializeRentalFleet(result));
    } catch (e) {
      return next(e);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await RentalFleetService.getAll(req.query);
      return res.status(200).json(paginateRentalFleet(result));
    } catch (e) {
      return next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await RentalFleetService.getById(id);
      return res.status(200).json(serializeRentalFleet(result));
    } catch (e) {
      return next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await RentalFleetService.update(req.body, id);
      if (result) {
        return res.status(200).json(serializeRentalFleet(result));
      }
      return res.status(400).send([{ description: 'Bad Request', name: 'Something went wrong!' }]);
    } catch (e) {
      return next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const removed = await RentalFleetService.delete(id);
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
