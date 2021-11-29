import request from 'supertest';
import { RentalReserve } from '@interfaces/rental/reserve/RentalReserve';
import app from '../../../../src/app';
import factory from '../../../utils/factorys/RentalReserveFactory';
import checkDefaultErrorFormat from '../../../utils/formats/ErrorFormat';
import { RENTALRESERVEPREFIX, TOKEN } from '../../../utils/Constants';
import { checkDefaultRentalsReserveFormat } from '../../../utils/formats/RentalReserveFormat';

describe('src :: api :: controllers :: rental :: reserve :: getAll', () => {
  describe('GIVEN 10 existing rental car of a company and 5 of others', () => {
    describe('WHEN searched with empty query params', () => {
      let response: request.Response;
      let baseGenerated: RentalReserve;

      beforeEach(async () => {
        baseGenerated = await factory.create<RentalReserve>('RentalReserve');
        await factory.createMany<RentalReserve>('RentalReserve', 9, {
          id_locadora: baseGenerated.id_locadora?.toString()
        });
        // create 5 with random id_locadora to check if it will be filtered
        await factory.createMany<RentalReserve>('RentalReserve', 5);
        response = await request(app)
          .get(`${RENTALRESERVEPREFIX.replace('{id}', baseGenerated.id_locadora?.toString() as string)}`)
          .set(TOKEN);
      });

      test('THEN it should return status code 200', async () => {
        expect(response.status).toBe(200);
      });

      test('THEN it should match de defined body format', async () => {
        checkDefaultRentalsReserveFormat(response.body);
      });

      test('THEN it should return all the 10 existing registers for the id_locadora', async () => {
        const { body } = response;
        expect(body.reservas).toHaveLength(10);
        expect(body.limit).toEqual(100);
        expect(body.offset).toEqual(1);
        expect(body.offsets).toEqual(1);
        expect(body.total).toEqual(10);
        body.reservas.forEach((element) => {
          expect(element.id_locadora).toBe(baseGenerated.id_locadora?.toString());
        });
      });
    });

    describe('WHEN searched passing limit=5', () => {
      let response: request.Response;
      let baseGenerated: RentalReserve;

      beforeEach(async () => {
        baseGenerated = await factory.create<RentalReserve>('RentalReserve');
        await factory.createMany<RentalReserve>('RentalReserve', 9, {
          id_locadora: baseGenerated.id_locadora?.toString()
        });
        // create 5 with random id_locadora to check if it will be filtered
        await factory.createMany<RentalReserve>('RentalReserve', 5);
        response = await request(app)
          .get(`${RENTALRESERVEPREFIX.replace('{id}', baseGenerated.id_locadora?.toString() as string)}?limit=5`)
          .set(TOKEN);
      });
      test('THEN it should return status code 200', async () => {
        expect(response.status).toBe(200);
      });

      test('THEN it should match de defined body format', async () => {
        checkDefaultRentalsReserveFormat(response.body);
      });

      test('THEN it should return just 5 of the 10 existing registers for the id_locadora', async () => {
        const { body } = response;
        expect(body.reservas).toHaveLength(5);
        expect(body.limit).toEqual(5);
        expect(body.offset).toEqual(1);
        expect(body.offsets).toEqual(2);
        expect(body.total).toEqual(10);
        body.reservas.forEach((element) => {
          expect(element.id_locadora).toBe(baseGenerated.id_locadora?.toString());
        });
      });
    });

    describe('WHEN searched passing limit=5 and offset=2', () => {
      let response: request.Response;
      let baseGenerated: RentalReserve;

      beforeEach(async () => {
        baseGenerated = await factory.create<RentalReserve>('RentalReserve');
        await factory.createMany<RentalReserve>('RentalReserve', 9, {
          id_locadora: baseGenerated.id_locadora?.toString()
        });
        // create 5 with random id_locadora to check if it will be filtered
        await factory.createMany<RentalReserve>('RentalReserve', 5);
        response = await request(app)
          .get(
            `${RENTALRESERVEPREFIX.replace('{id}', baseGenerated.id_locadora?.toString() as string)}?limit=5&offset=2`
          )
          .set(TOKEN);
      });

      test('THEN it should return status code 200', async () => {
        expect(response.status).toBe(200);
      });

      test('THEN it should match de defined body format', async () => {
        checkDefaultRentalsReserveFormat(response.body);
      });

      test('THEN it should return last 5 of the 10 existing registers for the id_locadora', async () => {
        const { body } = response;
        expect(body.reservas).toHaveLength(5);
        expect(body.limit).toEqual(5);
        expect(body.offset).toEqual(2);
        expect(body.offsets).toEqual(2);
        expect(body.total).toEqual(10);
        body.reservas.forEach((element) => {
          expect(element.id_locadora).toBe(baseGenerated.id_locadora?.toString());
        });
      });
    });

    describe('WHEN searched passing id_carro', () => {
      let response: request.Response;
      let baseGenerated: RentalReserve;

      beforeEach(async () => {
        baseGenerated = await factory.create<RentalReserve>('RentalReserve');
        await factory.createMany<RentalReserve>('RentalReserve', 9, {
          id_locadora: baseGenerated.id_locadora
        });
        // create 5 with random id_locadora to check if it will be filtered
        await factory.createMany<RentalReserve>('RentalReserve', 5);
        response = await request(app)
          .get(
            `${RENTALRESERVEPREFIX.replace(
              '{id}',
              baseGenerated.id_locadora?.toString() as string
            )}?id_carro=${baseGenerated.id_carro.toString()}`
          )
          .set(TOKEN);
      });

      test('THEN it should return status code 200', async () => {
        expect(response.status).toBe(200);
      });

      test('THEN it should match de defined body format', async () => {
        checkDefaultRentalsReserveFormat(response.body);
      });

      test('THEN it should return just 1 of the 10 existing registers for the id_locadora', async () => {
        const { body } = response;
        expect(body.reservas).toHaveLength(1);
        expect(body.limit).toEqual(100);
        expect(body.offset).toEqual(1);
        expect(body.offsets).toEqual(1);
        expect(body.total).toEqual(1);
        body.reservas.forEach((element) => {
          expect(element.id_locadora).toBe(baseGenerated.id_locadora?.toString());
          expect(element.id_carro).toBe(baseGenerated.id_carro?.toString());
        });
      });
    });

    describe('WHEN searched passing empty id_carro', () => {
      let response: request.Response;

      beforeEach(async () => {
        const baseGenerated = await factory.create<RentalReserve>('RentalReserve');
        response = await request(app)
          .get(`${RENTALRESERVEPREFIX.replace('{id}', baseGenerated.id_locadora?.toString() as string)}?id_carro=`)
          .set(TOKEN);
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
        expect(body[0].name).toBe('"id_carro" is not allowed to be empty');
        expect(body[0].description).toBe('id_carro');
      });
    });

    describe('WHEN searched passing invalid id_carro', () => {
      let response: request.Response;

      beforeEach(async () => {
        const baseGenerated = await factory.create<RentalReserve>('RentalReserve');
        response = await request(app)
          .get(
            `${RENTALRESERVEPREFIX.replace('{id}', baseGenerated.id_locadora?.toString() as string)}?id_carro=15asd15a`
          )
          .set(TOKEN);
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
        expect(body[0].name).toBe('"id_carro" length must be 24 characters long');
        expect(body[0].description).toBe('id_carro');
        expect(body[1].name).toBe('Invalid id_carro');
        expect(body[1].description).toBe('id_carro');
      });
    });

    describe('WHEN trying to get with a rental ID that is invalid', () => {
      let response: request.Response;
      beforeEach(async () => {
        response = await request(app)
          .get(`${RENTALRESERVEPREFIX.replace('{id}', '23')}`)
          .set(TOKEN);
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

      beforeEach(async () => {
        const baseGenerated = await factory.create<RentalReserve>('RentalReserve');
        response = await request(app)
          .get(`${RENTALRESERVEPREFIX.replace('{id}', baseGenerated.id_locadora?.toString() as string)}?motor=v12`)
          .set(TOKEN);
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

    describe('WHEN searched passing valor_final', () => {
      let response: request.Response;
      let baseGenerated: RentalReserve;
      let value: string;

      beforeEach(async () => {
        baseGenerated = await factory.create<RentalReserve>('RentalReserve');
        await factory.createMany<RentalReserve>('RentalReserve', 9, {
          id_locadora: baseGenerated.id_locadora
        });
        value = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(
          baseGenerated.valor_final as number
        );
        response = await request(app)
          .get(
            `${RENTALRESERVEPREFIX.replace(
              '{id}',
              baseGenerated.id_locadora?.toString() as string
            )}?valor_final=${value}`
          )
          .set(TOKEN);
      });

      test('THEN it should return status code 200', async () => {
        expect(response.status).toBe(200);
      });

      test('THEN it should match de defined body format', async () => {
        checkDefaultRentalsReserveFormat(response.body);
      });

      test('THEN it should return just 1 of the 10 existing registers for the id_locadora', async () => {
        const { body } = response;
        expect(body.reservas).toHaveLength(1);
        expect(body.limit).toEqual(100);
        expect(body.offset).toEqual(1);
        expect(body.offsets).toEqual(1);
        expect(body.total).toEqual(1);
        body.reservas.forEach((element) => {
          expect(element.id_locadora).toBe(baseGenerated.id_locadora?.toString());
          expect(element.valor_final).toEqual(value);
        });
      });
    });
  });
});
