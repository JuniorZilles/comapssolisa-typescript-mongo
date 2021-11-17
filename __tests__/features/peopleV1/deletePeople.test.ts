import request from 'supertest';
import { Person } from '@interfaces/people/Person';
import app from '../../../src/app';
import factory from '../../utils/factorys/PeopleFactory';
import checkDefaultErrorFormat from '../../utils/formats/ErrorFormat';
import { PERSONPREFIX } from '../../utils/Constants';

describe('src :: api :: controllers :: people :: delete', () => {
  test("should remove a person by it's ID", async () => {
    const peopleData = await factory.create<Person>('People');

    const response = await request(app).delete(`${PERSONPREFIX}/${peopleData._id}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  test('should return 400 with errors if ID is invalid when removing', async () => {
    const response = await request(app).delete(`${PERSONPREFIX}/12`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(2);
    expect(body[0].description).toBe('id');
    expect(body[0].name).toBe('"id" length must be 24 characters long');
  });

  test('should return 404 with error if ID is not found when removing', async () => {
    const response = await request(app).delete(`${PERSONPREFIX}/6171508962f47a7a91938d30`);
    const { body } = response;

    expect(response.status).toBe(404);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Not Found');
    expect(body[0].name).toBe('Value 6171508962f47a7a91938d30 not found');
  });
});
