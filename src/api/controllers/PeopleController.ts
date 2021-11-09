import PeopleService from '@services/PeopleService';
import { Request, Response, NextFunction } from 'express';

class PeopleController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const people = await PeopleService.create(req.body);

      return res.status(201).json(people);
    } catch (e) {
      return next(e);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { offset, limit, ...query } = req.query;
      const limitNumber = limit ? parseInt(limit as string, 10) : 100;
      const offsetNumber = offset ? parseInt(offset as string, 10) : 0;
      const people = await PeopleService.list(offsetNumber, limitNumber, query);
      return res.status(200).json(people);
    } catch (e) {
      return next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const people = await PeopleService.getById(req.params.id);
      return res.status(200).json(people);
    } catch (e) {
      return next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updated = await PeopleService.update(id, req.body);
      if (updated) {
        return res.status(200).json(updated);
      }
      return res.status(400).send([{ description: 'Bad Request', name: 'Something went wrong!' }]);
    } catch (e) {
      return next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const removed = await PeopleService.delete(id);
      if (removed) {
        return res.status(204).end();
      }
      return res.status(400).send([{ description: 'Bad Request', name: 'Something went wrong!' }]);
    } catch (e) {
      return next(e);
    }
  }
}

export default new PeopleController();
