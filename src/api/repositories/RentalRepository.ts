import { isValid } from '@models/Model';

/* eslint-disable class-methods-use-this */
class RentalRepository {
  async create(): Promise<string> {
    return '';
  }

  async findAll(): Promise<string> {
    return '';
  }

  async delete(id: string): Promise<boolean> {
    return true;
  }

  async findById(id: string): Promise<string> {
    return '';
  }

  validId(id: string): boolean {
    return isValid(id);
  }

  async update(id: string): Promise<string> {
    return '';
  }
}

export default new RentalRepository();
