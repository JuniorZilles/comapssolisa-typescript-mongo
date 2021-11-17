import request from 'supertest';
import { Rental } from '@interfaces/Rental';
import app from '../../../src/app';
import factory from '../../utils/factorys/RentalFactory';
import checkDefaultErrorFormat from '../../utils/formats/ErrorFormat';
import { RENTALPREFIX } from '../../utils/Constants';

describe('src :: api :: controllers :: rental :: delete', () => {
  test("should remove a rental company by it's ID", async () => {
    const tempData = await factory.create<Rental>('Rental');

    const response = await request(app).delete(`${RENTALPREFIX}/${tempData._id}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  test('should return 400 with errors if ID is invalid when removing', async () => {
    const response = await request(app).delete(`${RENTALPREFIX}/12`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(2);
    expect(body[0].description).toBe('id');
    expect(body[0].name).toBe('"id" length must be 24 characters long');
  });

  test('should return 404 with error if ID is not found when removing', async () => {
    const response = await request(app).delete(`${RENTALPREFIX}/6171508962f47a7a91938d30`);
    const { body } = response;

    expect(response.status).toBe(404);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Not Found');
    expect(body[0].name).toBe('Value 6171508962f47a7a91938d30 not found');
  });
});
