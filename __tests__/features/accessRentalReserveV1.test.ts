import request from 'supertest';
import checkDefaultErrorFormat from '../utils/formats/ErrorFormat';
import app from '../../src/app';
import { RENTALRESERVEPREFIX } from '../utils/Constants';

describe('src :: api :: controllers :: rental :: reserve', () => {
  test('should return 401 for misssing autorization header', async () => {
    const response = await request(app).get(`${RENTALRESERVEPREFIX.replace('{id}', '6171508962f47a7a91938d30')}`);
    const { body } = response;

    expect(response.status).toBe(401);
    checkDefaultErrorFormat(body);
    expect(body[0].description).toBe('Bearer');
    expect(body[0].name).toBe('Token not provided');
  });

  test('should return 401 for invalid format', async () => {
    const tokenTemp = { authorization: `113f5s1dsa5f12s1f21sdf` };
    const response = await request(app)
      .get(`${RENTALRESERVEPREFIX.replace('{id}', '6171508962f47a7a91938d30')}`)
      .set(tokenTemp);
    const { body } = response;

    expect(response.status).toBe(401);
    checkDefaultErrorFormat(body);
    expect(body[0].description).toBe('Bearer');
    expect(body[0].name).toBe('Token error');
  });

  test('should return 401 for invalid Bearer', async () => {
    const tokenTemp = { authorization: `Barra 113f5s1dsa5f12s1f21sdf` };
    const response = await request(app)
      .get(`${RENTALRESERVEPREFIX.replace('{id}', '6171508962f47a7a91938d30')}`)
      .set(tokenTemp);
    const { body } = response;

    expect(response.status).toBe(401);
    checkDefaultErrorFormat(body);
    expect(body[0].description).toBe('Bearer');
    expect(body[0].name).toBe('Token malformatted');
  });

  test('should return 401 for invalid Token', async () => {
    const tokenTemp = { authorization: `Bearer 113f5s1dsa5f12s1f21sdf` };
    const response = await request(app)
      .get(`${RENTALRESERVEPREFIX.replace('{id}', '6171508962f47a7a91938d30')}`)
      .set(tokenTemp);
    const { body } = response;

    expect(response.status).toBe(401);
    checkDefaultErrorFormat(body);
    expect(body[0].description).toBe('Bearer');
    expect(body[0].name).toBe('Token invalid');
  });
});
