import request from 'supertest';
import Car from '@interfaces/car/Car';
import app from '../../../src/app';
import factory from '../../utils/factorys/CarFactory';
import checkDefaultErrorFormat from '../../utils/formats/ErrorFormat';
import { CARPREFIX, TOKEN } from '../../utils/Constants';

describe('src :: api :: controllers :: car :: delete', () => {
  test("should remove a car by it's ID", async () => {
    const carUsed = await factory.create<Car>('Car');

    if (carUsed._id) {
      const response = await request(app).delete(`${CARPREFIX}/${carUsed._id}`).set(TOKEN);
      const { body } = response;

      expect(response.status).toBe(204);
      expect(body).toEqual({});
    } else {
      expect(carUsed._id).toBeDefined();
    }
  });

  test('should return 400 with errors if ID is invalid when removing', async () => {
    const response = await request(app).delete(`${CARPREFIX}/12`).set(TOKEN);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(2);
    expect(body[0].description).toBe('id');
    expect(body[0].name).toBe('"id" length must be 24 characters long');
  });

  test('should return 404 with error if ID is notfound when removing', async () => {
    const response = await request(app).delete(`${CARPREFIX}/6171508962f47a7a91938d30`).set(TOKEN);

    const { body } = response;

    expect(response.status).toBe(404);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Not Found');
    expect(body[0].name).toBe('Value 6171508962f47a7a91938d30 not found');
  });
});
