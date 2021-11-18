import RentalReserveService from '@services/rental/reserve/RentalReserveService';
import { paginateRentalReserve, serializeRentalReserve } from '@serialize/RentalReserveSerialize';
import { Request, Response, NextFunction } from 'express';

class RentalReserveController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await RentalReserveService.create(id, req.body);
      return res.status(201).json(serializeRentalReserve(result));
    } catch (e) {
      return next(e);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await RentalReserveService.getAll(id, req.query);
      return res.status(200).json(paginateRentalReserve(result));
    } catch (e) {
      return next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, idReserve } = req.params;
      const result = await RentalReserveService.getById(id, idReserve);
      return res.status(200).json(serializeRentalReserve(result));
    } catch (e) {
      return next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, idReserve } = req.params;
      const result = await RentalReserveService.update(id, idReserve, req.body);
      if (result) {
        return res.status(200).json(serializeRentalReserve(result));
      }
      return res.status(400).send([{ description: 'Bad Request', name: 'Something went wrong!' }]);
    } catch (e) {
      return next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, idReserve } = req.params;
      const removed = await RentalReserveService.delete(id, idReserve);
      if (removed) {
        return res.status(204).end();
      }
      return res.status(400).send([{ description: 'Bad Request', name: 'Something went wrong!' }]);
    } catch (e) {
      return next(e);
    }
  }
}

export default new RentalReserveController();
