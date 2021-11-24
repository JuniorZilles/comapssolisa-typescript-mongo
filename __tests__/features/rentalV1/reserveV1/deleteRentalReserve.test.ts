/* eslint-disable @typescript-eslint/naming-convention */
import request from 'supertest';
import { RentalReserve } from '@interfaces/rental/reserve/RentalReserve';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import app from '../../../../src/app';
import factory from '../../../utils/factorys/RentalReserveFactory';
import fleetFactory from '../../../utils/factorys/RentalFleetFactory';
import checkDefaultErrorFormat from '../../../utils/formats/ErrorFormat';
import { RENTALRESERVEPREFIX, TOKEN } from '../../../utils/Constants';

describe('src :: api :: controllers :: rental :: reserve :: delete', () => {
  describe('GIVEN a DELETE for removing a rental car', () => {
    describe('WHEN there is a car with the especified id and idFleet', () => {
      let response: request.Response;
      beforeEach(async () => {
        const fleetInfo = await fleetFactory.create<RentalFleet>('RentalFleet');
        const { _id } = await factory.create<RentalReserve>('RentalReserve', {
          id_locadora: fleetInfo.id_locadora?.toString() as string,
          id_carro: fleetInfo.id_carro?.toString() as string
        });
        response = await request(app)
          .delete(
            `${RENTALRESERVEPREFIX.replace('{id}', fleetInfo.id_locadora?.toString() as string)}/${
              _id?.toString() as string
            }`
          )
          .set(TOKEN);
      });

      test('THEN it should return status code 204', async () => {
        expect(response.status).toBe(204);
      });

      test('THEN it should return a empty body', async () => {
        expect(response.body).toEqual({});
      });
    });

    describe('WHEN trying to remove a reserve that is not from the rental company', () => {
      let response: request.Response;
      let idReserva: string;
      let idLocadora: string;
      beforeEach(async () => {
        const { _id } = await factory.create<RentalReserve>('RentalReserve');
        idReserva = _id?.toString() as string;
        const fleetInfo = await fleetFactory.create<RentalFleet>('RentalFleet');
        await factory.create<RentalReserve>('RentalReserve', {
          id_locadora: fleetInfo.id_locadora?.toString() as string,
          id_carro: fleetInfo.id_carro?.toString() as string
        });
        idLocadora = fleetInfo.id_locadora?.toString() as string;
        response = await request(app)
          .delete(`${RENTALRESERVEPREFIX.replace('{id}', idLocadora)}/${idReserva}`)
          .set(TOKEN);
      });
      test('THEN it should return status 404 for validation error', async () => {
        expect(response.status).toBe(404);
      });

      test('THEN it should return a body with the especified error format', async () => {
        checkDefaultErrorFormat(response.body);
      });

      test('THEN it should return a body with invalid idFleet error', async () => {
        const { body } = response;
        expect(body).toHaveLength(1);
        expect(body[0].name).toBe(`Value id: ${idLocadora} - idReserve: ${idReserva} not found`);
        expect(body[0].description).toBe('Not Found');
      });
    });

    describe('WHEN trying to delete with a rental company ID that is invalid', () => {
      let response: request.Response;
      beforeEach(async () => {
        response = await request(app)
          .delete(`${RENTALRESERVEPREFIX.replace('{id}', '23')}/6171508962f47a7a91938d30`)
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

    describe('WHEN trying to delete with a reserve ID that is invalid', () => {
      let response: request.Response;
      beforeEach(async () => {
        response = await request(app)
          .delete(`${RENTALRESERVEPREFIX.replace('{id}', '6171508962f47a7a91938d30')}/1523`)
          .set(TOKEN);
      });

      test('THEN it should return status 400 for validation error', async () => {
        expect(response.status).toBe(400);
      });

      test('THEN it should return a body with the especified error format', async () => {
        checkDefaultErrorFormat(response.body);
      });

      test('THEN it should return a body with invalid idReserve error', async () => {
        const { body } = response;
        expect(body).toHaveLength(2);
        expect(body[0].name).toBe('"idReserve" length must be 24 characters long');
        expect(body[0].description).toBe('idReserve');
        expect(body[1].name).toBe('Invalid idReserve');
        expect(body[1].description).toBe('idReserve');
      });
    });

    describe('WHEN trying to delete with a reserve ID that is not existent', () => {
      let response: request.Response;
      let cretedIdLocadora: string;
      beforeEach(async () => {
        const { id_locadora } = await factory.create<RentalReserve>('RentalReserve');
        response = await request(app)
          .delete(`${RENTALRESERVEPREFIX.replace('{id}', id_locadora?.toString() as string)}/6171508962f47a7a91938d30`)
          .set(TOKEN);
        cretedIdLocadora = id_locadora?.toString() as string;
      });

      test('THEN it should return status 404 for validation error', async () => {
        expect(response.status).toBe(404);
      });

      test('THEN it should return a body with the especified error format', async () => {
        checkDefaultErrorFormat(response.body);
      });

      test('THEN it should return a body with invalid idReserve error', async () => {
        const { body } = response;
        expect(body).toHaveLength(1);
        expect(body[0].name).toBe(`Value id: ${cretedIdLocadora} - idReserve: 6171508962f47a7a91938d30 not found`);
        expect(body[0].description).toBe('Not Found');
      });
    });

    describe('WHEN trying to delete with a rental company ID that is not existent', () => {
      let response: request.Response;
      let cretedIdReserve: string;
      beforeEach(async () => {
        const { _id } = await factory.create<RentalReserve>('RentalReserve');
        response = await request(app)
          .delete(`${RENTALRESERVEPREFIX.replace('{id}', '6171508962f47a7a91938d30')}/${_id?.toString()}`)
          .set(TOKEN);
        cretedIdReserve = _id?.toString() as string;
      });

      test('THEN it should return status 404 for validation error', async () => {
        expect(response.status).toBe(404);
      });

      test('THEN it should return a body with the especified error format', async () => {
        checkDefaultErrorFormat(response.body);
      });

      test('THEN it should return a body with invalid idReserve error', async () => {
        const { body } = response;
        expect(body).toHaveLength(1);
        expect(body[0].name).toBe(`Value id: 6171508962f47a7a91938d30 - idReserve: ${cretedIdReserve} not found`);
        expect(body[0].description).toBe('Not Found');
      });
    });
  });
});
