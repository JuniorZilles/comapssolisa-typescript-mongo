import { List } from '@interfaces/List';
import { Pagination } from '@interfaces/Pagination';
import { isValid } from '@models/Model';
import { Model } from 'mongoose';

class Repository<Search extends Pagination, Z extends List, Payload> {
  constructor(private model: typeof Model) {}

  async create(payload: Payload): Promise<Payload> {
    const result = await this.model.create(payload);
    return result;
  }

  async findAll(payload: Search, name: string): Promise<Z> {
    const { offset, limit, ...query } = payload;
    const count = await this.model.countDocuments(query);
    const limitNumber = limit ? parseInt(limit as string, 10) : 100;
    const offsetNumber = offset ? parseInt(offset as string, 10) : 0;
    const list = await this.model
      .find(query)
      .skip(offsetNumber * limitNumber)
      .limit(limitNumber);
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

  async delete(id: string): Promise<Payload> {
    const result = await this.model.findByIdAndDelete(id);
    return result;
  }

  async findById(id: string): Promise<Payload> {
    const result = await this.model.findById(id);
    return result;
  }

  validId(id: string): boolean {
    return isValid(id);
  }

  async update(id: string, payload: Payload): Promise<Payload> {
    const result = await this.model.findByIdAndUpdate(id, payload, {
      returnOriginal: false
    });
    return result;
  }
}

export default Repository;
