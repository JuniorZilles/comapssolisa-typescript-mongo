/* eslint-disable @typescript-eslint/naming-convention */
import request from 'supertest';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import app from '../../../../src/app';
import factory from '../../../utils/factorys/RentalFleetFactory';
import checkDefaultErrorFormat from '../../../utils/formats/ErrorFormat';
import { RENTALFLEETPREFIX } from '../../../utils/Constants';

describe('src :: api :: controllers :: rental :: fleet :: delete', () => {
  describe('GIVEN a call to delete a rental car', () => {
    describe('WHEN there is a car with the especified id and idFleet', () => {
      let response: request.Response;
      beforeEach(async () => {
        const { id_locadora, _id } = await factory.create<RentalFleet>('RentalFleet');
        response = await request(app).delete(
          `${RENTALFLEETPREFIX.replace('{id}', id_locadora?.toString() as string)}/${_id?.toString() as string}`
        );
      });

      test('THEN it should return status code 204', async () => {
        expect(response.status).toBe(204);
      });

      test('THEN it should return a empty body', async () => {
        expect(response.body).toEqual({});
      });
    });

    describe('WHEN trying to remove a rental car that is not from the rental company', () => {
      let response: request.Response;
      let generatedRental: RentalFleet;
      let generatedFleet: RentalFleet;
      beforeEach(async () => {
        generatedRental = await factory.create<RentalFleet>('RentalFleet');
        generatedFleet = await factory.create<RentalFleet>('RentalFleet');
        response = await request(app).delete(
          `${RENTALFLEETPREFIX.replace('{id}', generatedRental.id_locadora?.toString() as string)}/${
            generatedFleet._id?.toString() as string
          }`
        );
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
        expect(body[0].name).toBe(
          `Value id: ${generatedRental.id_locadora?.toString() as string} - idFleet: ${
            generatedFleet._id?.toString() as string
          } not found`
        );
        expect(body[0].description).toBe('Not Found');
      });
    });

    describe('WHEN trying to delete with a rental company ID that is invalid', () => {
      let response: request.Response;
      beforeEach(async () => {
        response = await request(app).delete(`${RENTALFLEETPREFIX.replace('{id}', '23')}/6171508962f47a7a91938d30`);
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

    describe('WHEN trying to delete with a fleet ID that is invalid', () => {
      let response: request.Response;
      beforeEach(async () => {
        response = await request(app).delete(`${RENTALFLEETPREFIX.replace('{id}', '6171508962f47a7a91938d30')}/1523`);
      });

      test('THEN it should return status 400 for validation error', async () => {
        expect(response.status).toBe(400);
      });

      test('THEN it should return a body with the especified error format', async () => {
        checkDefaultErrorFormat(response.body);
      });

      test('THEN it should return a body with invalid idFleet error', async () => {
        const { body } = response;
        expect(body).toHaveLength(2);
        expect(body[0].name).toBe('"idFleet" length must be 24 characters long');
        expect(body[0].description).toBe('idFleet');
        expect(body[1].name).toBe('Invalid idFleet');
        expect(body[1].description).toBe('idFleet');
      });
    });

    describe('WHEN trying to delete with a fleet ID that is not existent', () => {
      let response: request.Response;
      let cretedIdLocadora: string;
      beforeEach(async () => {
        const { id_locadora } = await factory.create<RentalFleet>('RentalFleet');
        response = await request(app).delete(
          `${RENTALFLEETPREFIX.replace('{id}', id_locadora?.toString() as string)}/6171508962f47a7a91938d30`
        );
        cretedIdLocadora = id_locadora?.toString() as string;
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
        expect(body[0].name).toBe(`Value id: ${cretedIdLocadora} - idFleet: 6171508962f47a7a91938d30 not found`);
        expect(body[0].description).toBe('Not Found');
      });
    });

    describe('WHEN trying to delete with a rental company ID that is not existent', () => {
      let response: request.Response;
      let cretedIdFleet: string;
      beforeEach(async () => {
        const result = await factory.create<RentalFleet>('RentalFleet');
        response = await request(app).delete(
          `${RENTALFLEETPREFIX.replace('{id}', '6171508962f47a7a91938d30')}/${result._id?.toString()}`
        );
        cretedIdFleet = result._id?.toString() as string;
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
        expect(body[0].name).toBe(`Value id: 6171508962f47a7a91938d30 - idFleet: ${cretedIdFleet} not found`);
        expect(body[0].description).toBe('Not Found');
      });
    });
  });
});
