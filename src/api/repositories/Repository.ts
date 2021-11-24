import { Paginate } from '@interfaces/Paginate';
import { Pagination } from '@interfaces/Pagination';
import mongoose from 'mongoose';

class Repository<Query extends Pagination, Content> {
  constructor(private model: mongoose.PaginateModel<Content>) {}

  async create(payload: Content): Promise<Content> {
    const result = await this.model.create(payload);
    return result;
  }

  async findAll(payload: Query): Promise<Paginate<Content>> {
    const { offset, limit, ...query } = payload;
    const result = await this.model.paginate(query as Query, {
      page: offset ? parseInt(offset as string, 10) : 0,
      limit: limit ? parseInt(limit as string, 10) : 100,
      customLabels: {
        totalDocs: 'total',
        page: 'offset',
        totalPages: 'offsets'
      }
    });

    return result as unknown as Paginate<Content>;
  }

  async delete(id: string): Promise<Content> {
    const result = (await this.model.findByIdAndDelete(id)) as Content;
    return result;
  }

  async findById(id: string): Promise<Content> {
    return (await this.model.findById(id)) as Content;
  }

  async update(id: string, payload: Content): Promise<Content> {
    return (await this.model.findByIdAndUpdate(id, payload, {
      returnOriginal: false
    })) as Content;
  }
}

export default Repository;
