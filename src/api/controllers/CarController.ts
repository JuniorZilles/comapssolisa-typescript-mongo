/* eslint-disable class-methods-use-this */
import { CarSearch } from '@interfaces/CarSearch';
import CarService from '@services/CarService';
import { Request, Response, NextFunction } from 'express';

class CarController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const car = await CarService.create(req.body);
      return res.status(201).json(car);
    } catch (e) {
      return next(e);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const cars = await CarService.list(req.query as CarSearch);
      return res.status(200).json(cars);
    } catch (e) {
      return next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const car = await CarService.getById(id);
      return res.status(200).json(car);
    } catch (e) {
      return next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updated = await CarService.update(id, req.body);
      if (updated) {
        return res.status(200).json(updated);
      }
      return res
        .status(400)
        .send([{ description: 'Bad Request', name: 'Something went wrong!' }]);
    } catch (e) {
      return next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const removed = await CarService.delete(id);
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

  patchAcessorios(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, idAcessorios } = req.params;
      const updated = CarService.updateAccessory(id, idAcessorios, req.body);
      return res.status(200).json(updated);
    } catch (e) {
      return next(e);
    }
  }
}

export default new CarController();
