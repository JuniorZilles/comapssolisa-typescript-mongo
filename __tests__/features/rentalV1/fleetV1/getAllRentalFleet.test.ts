import request from 'supertest';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import app from '../../../../src/app';
import factory from '../../../utils/factorys/RentalFleetFactory';
import checkDefaultErrorFormat from '../../../utils/formats/ErrorFormat';
import { RENTALFLEETPREFIX } from '../../../utils/Constants';
import { checkDefaultRentalsFleetFormat } from '../../../utils/formats/RentalFleetFormat';

describe('src :: api :: controllers :: rental :: fleet :: getAll', () => {
  describe('GIVEN 10 existing rental car of a company and 5 of others', () => {
    describe('WHEN searched with empty query params', () => {
      let response: request.Response;
      let baseGenerated: RentalFleet;

      beforeEach(async () => {
        baseGenerated = await factory.create<RentalFleet>('RentalFleet', { status: 'disponível' });
        await factory.createMany<RentalFleet>('RentalFleet', 9, {
          status: 'disponível',
          id_locadora: baseGenerated.id_locadora
        });
        // create 5 with random id_locadora to check if it will be filtered
        await factory.createMany<RentalFleet>('RentalFleet', 5, { status: 'disponível' });
        response = await request(app).get(
          `${RENTALFLEETPREFIX.replace('{id}', baseGenerated.id_locadora?.toString() as string)}`
        );
      });
      test('THEN it should return status code 200', async () => {
        expect(response.status).toBe(200);
      });

      test('THEN it should match de defined body format', async () => {
        checkDefaultRentalsFleetFormat(response.body);
      });
      test('THEN it should return all the 5 existing registers', async () => {
        const { body } = response;
        expect(body.frota).toHaveLength(10);
        expect(body.limit).toEqual(100);
        expect(body.offset).toEqual(1);
        expect(body.offsets).toEqual(1);
        expect(body.total).toEqual(10);
        body.frota.forEach((element) => {
          expect(element.id_locadora).toBe(baseGenerated.id_locadora?.toString());
        });
      });
    });
    describe('WHEN searched passing limit=5', () => {
      let response: request.Response;
      let baseGenerated: RentalFleet;

      beforeEach(async () => {
        baseGenerated = await factory.create<RentalFleet>('RentalFleet', { status: 'disponível' });
        await factory.createMany<RentalFleet>('RentalFleet', 9, {
          status: 'disponível',
          id_locadora: baseGenerated.id_locadora
        });
        // create 5 with random id_locadora to check if it will be filtered
        await factory.createMany<RentalFleet>('RentalFleet', 5, { status: 'disponível' });
        response = await request(app).get(
          `${RENTALFLEETPREFIX.replace('{id}', baseGenerated.id_locadora?.toString() as string)}?limit=5`
        );
      });
      test('THEN it should return status code 200', async () => {
        expect(response.status).toBe(200);
      });

      test('THEN it should match de defined body format', async () => {
        checkDefaultRentalsFleetFormat(response.body);
      });

      test('THEN it should return just 5 of the 10 existing registers', async () => {
        const { body } = response;
        expect(body.frota).toHaveLength(5);
        expect(body.limit).toEqual(5);
        expect(body.offset).toEqual(1);
        expect(body.offsets).toEqual(2);
        expect(body.total).toEqual(10);
        body.frota.forEach((element) => {
          expect(element.id_locadora).toBe(baseGenerated.id_locadora?.toString());
        });
      });
    });
    describe('WHEN searched passing limit=5 and offset=2', () => {
      let response: request.Response;
      let baseGenerated: RentalFleet;

      beforeEach(async () => {
        baseGenerated = await factory.create<RentalFleet>('RentalFleet', { status: 'disponível' });
        await factory.createMany<RentalFleet>('RentalFleet', 9, {
          status: 'disponível',
          id_locadora: baseGenerated.id_locadora
        });
        // create 5 with random id_locadora to check if it will be filtered
        await factory.createMany<RentalFleet>('RentalFleet', 5, { status: 'disponível' });
        response = await request(app).get(
          `${RENTALFLEETPREFIX.replace('{id}', baseGenerated.id_locadora?.toString() as string)}?limit=5&offset=2`
        );
      });

      test('THEN it should return status code 200', async () => {
        expect(response.status).toBe(200);
      });

      test('THEN it should match de defined body format', async () => {
        checkDefaultRentalsFleetFormat(response.body);
      });

      test('THEN it should return last 5 of the 10 existing registers', async () => {
        const { body } = response;
        expect(body.frota).toHaveLength(5);
        expect(body.limit).toEqual(5);
        expect(body.offset).toEqual(2);
        expect(body.offsets).toEqual(2);
        expect(body.total).toEqual(10);
        body.frota.forEach((element) => {
          expect(element.id_locadora).toBe(baseGenerated.id_locadora?.toString());
        });
      });
    });

    describe('WHEN searched passing status=disponível', () => {
      let response: request.Response;
      let baseGenerated: RentalFleet;

      beforeEach(async () => {
        baseGenerated = await factory.create<RentalFleet>('RentalFleet', { status: 'disponível' });
        await factory.createMany<RentalFleet>('RentalFleet', 9, {
          status: 'disponível',
          id_locadora: baseGenerated.id_locadora
        });
        // create 5 with random id_locadora to check if it will be filtered
        await factory.createMany<RentalFleet>('RentalFleet', 5, { status: 'disponível' });
        response = await request(app).get(
          `${RENTALFLEETPREFIX.replace('{id}', baseGenerated.id_locadora?.toString() as string)}?status=disponível`
        );
      });

      test('THEN it should return status code 200', async () => {
        expect(response.status).toBe(200);
      });

      test('THEN it should match de defined body format', async () => {
        checkDefaultRentalsFleetFormat(response.body);
      });

      test('THEN it should return 10 of the 10 existing registers', async () => {
        const { body } = response;
        expect(body.frota).toHaveLength(10);
        expect(body.limit).toEqual(100);
        expect(body.offset).toEqual(1);
        expect(body.offsets).toEqual(1);
        expect(body.total).toEqual(10);
        body.frota.forEach((element) => {
          expect(element.id_locadora).toBe(baseGenerated.id_locadora?.toString());
          expect(element.status).toBe('disponível');
        });
      });
    });

    describe('WHEN searched passing empty status', () => {
      let response: request.Response;
      let baseGenerated: RentalFleet;

      beforeEach(async () => {
        baseGenerated = await factory.create<RentalFleet>('RentalFleet', { status: 'disponível' });
        await factory.createMany<RentalFleet>('RentalFleet', 9, {
          status: 'disponível',
          id_locadora: baseGenerated.id_locadora
        });
        // create 5 with random id_locadora to check if it will be filtered
        await factory.createMany<RentalFleet>('RentalFleet', 5, { status: 'disponível' });
        response = await request(app).get(
          `${RENTALFLEETPREFIX.replace('{id}', baseGenerated.id_locadora?.toString() as string)}?status=`
        );
      });

      test('THEN it should return status code 400', async () => {
        expect(response.status).toBe(400);
      });

      test('THEN it should match de defined body format', async () => {
        checkDefaultErrorFormat(response.body);
      });

      test('THEN it should return the validation error', async () => {
        const { body } = response;
        expect(body).toHaveLength(2);
        expect(body[0].name).toBe('"status" must be one of [disponível, indisponível]');
        expect(body[0].description).toBe('status');
        expect(body[1].name).toBe('"status" is not allowed to be empty');
        expect(body[1].description).toBe('status');
      });
    });

    describe('WHEN trying to get with a rental ID that is invalid', () => {
      let response: request.Response;
      let baseGenerated: RentalFleet;

      beforeEach(async () => {
        baseGenerated = await factory.create<RentalFleet>('RentalFleet', { status: 'disponível' });
        await factory.createMany<RentalFleet>('RentalFleet', 9, {
          status: 'disponível',
          id_locadora: baseGenerated.id_locadora
        });
        // create 5 with random id_locadora to check if it will be filtered
        await factory.createMany<RentalFleet>('RentalFleet', 5, { status: 'disponível' });
        response = await request(app).get(`${RENTALFLEETPREFIX.replace('{id}', '23')}`);
      });

      test('THEN it should return status 400 for validation error', async () => {
        expect(response.status).toBe(400);
      });

      test('THEN it should return a body with the especified error format', async () => {
        checkDefaultErrorFormat(response.body);
      });

      test('THEN it should return a body with invalid id error', async () => {
        const { body } = response;
        expect(body).toHaveLength(2);
        expect(body[0].name).toBe('"id" length must be 24 characters long');
        expect(body[0].description).toBe('id');
        expect(body[1].name).toBe('Invalid Id');
        expect(body[1].description).toBe('id');
      });
    });

    describe('WHEN searched passing invalid element', () => {
      let response: request.Response;
      let baseGenerated: RentalFleet;

      beforeEach(async () => {
        baseGenerated = await factory.create<RentalFleet>('RentalFleet', { status: 'disponível' });
        await factory.createMany<RentalFleet>('RentalFleet', 9, {
          status: 'disponível',
          id_locadora: baseGenerated.id_locadora
        });
        // create 5 with random id_locadora to check if it will be filtered
        await factory.createMany<RentalFleet>('RentalFleet', 5, { status: 'disponível' });
        response = await request(app).get(
          `${RENTALFLEETPREFIX.replace('{id}', baseGenerated.id_locadora?.toString() as string)}?motor=v12`
        );
      });

      test('THEN it should return status code 400', async () => {
        expect(response.status).toBe(400);
      });

      test('THEN it should match de defined body format', async () => {
        checkDefaultErrorFormat(response.body);
      });

      test('THEN it should return the validation error', async () => {
        const { body } = response;
        expect(body).toHaveLength(1);
        expect(body[0].name).toBe('"motor" is not allowed');
        expect(body[0].description).toBe('motor');
      });
    });
  });
});
