import { paginatePerson, serializePerson } from '@serialize/PersonSerialize';
import PeopleService from '@services/people';
import { Request, Response, NextFunction } from 'express';

class PeopleController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const person = await PeopleService.create(req.body);

      return res.status(201).json(serializePerson(person));
    } catch (e) {
      return next(e);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const people = await PeopleService.list(req.query);
      return res.status(200).json(paginatePerson(people));
    } catch (e) {
      return next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const person = await PeopleService.getById(req.params.id);
      return res.status(200).json(serializePerson(person));
    } catch (e) {
      return next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const person = await PeopleService.update(id, req.body);
      return res.status(200).json(serializePerson(person));
    } catch (e) {
      return next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await PeopleService.delete(id);
      return res.status(204).end();
    } catch (e) {
      return next(e);
    }
  }
}

export default new PeopleController();
