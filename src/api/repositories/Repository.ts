import { List } from '@interfaces/List';
import { Pagination } from '@interfaces/Pagination';
import { isValid } from '@models/Model';
import { Model } from 'mongoose';

class Repository<T extends Pagination, Z extends List, X> {
  constructor(private model: typeof Model) {}

  async create(payload: X): Promise<X> {
    const result = await this.model.create(payload);
    return result;
  }

  async findAll(payload: T, name: string): Promise<Z> {
    const { offset, limit, ...query } = payload;
    const count = await this.model.countDocuments(query);
    const limitNumber = limit ? parseInt(limit as string, 10) : 100;
    const offsetNumber = offset ? parseInt(offset as string, 10) : 0;
    const list = await this.model
      .find(query)
      .skip(offsetNumber * limitNumber)
      .limit(limitNumber)
      .exec();
    const offsets = Math.round(count / limitNumber);
    const obj = {
      offset: offsetNumber,
      limit: limitNumber,
      total: count,
      offsets
    };
    obj[name] = list;

    return obj as Z;
  }

  async delete(id: string): Promise<X> {
    const result = (await this.model.findByIdAndDelete(id).exec()) as X;
    return result;
  }

  async findById(id: string): Promise<X> {
    return (await this.model.findById(id)) as X;
  }

  validId(id: string): boolean {
    return isValid(id);
  }

  async update(id: string, payload: X): Promise<X> {
    return (await this.model
      .findByIdAndUpdate(id, payload, {
        returnOriginal: false
      })
      .exec()) as X;
  }
}

export default Repository;
