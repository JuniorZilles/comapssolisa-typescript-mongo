import { paginateCar, serializeCar } from '@serialize/CarSerialize';
import CarService from '@services/car';
import { Request, Response, NextFunction } from 'express';

class CarController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const car = await CarService.create(req.body);
      return res.status(201).json(serializeCar(car));
    } catch (e) {
      return next(e);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const cars = await CarService.list(req.query);
      return res.status(200).json(paginateCar(cars));
    } catch (e) {
      return next(e);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const car = await CarService.getById(id);
      return res.status(200).json(serializeCar(car));
    } catch (e) {
      return next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const car = await CarService.update(id, req.body);
      if (car) {
        return res.status(200).json(serializeCar(car));
      }
      return res.status(400).send([{ description: 'Bad Request', name: 'Something went wrong!' }]);
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
      return res.status(400).send([{ description: 'Bad Request', name: 'Something went wrong!' }]);
    } catch (e) {
      return next(e);
    }
  }

  async patchAcessorios(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, idAccessory } = req.params;
      const car = await CarService.updateAccessory(id, idAccessory, req.body);
      return res.status(200).json(serializeCar(car));
    } catch (e) {
      return next(e);
    }
  }
}

export default new CarController();
