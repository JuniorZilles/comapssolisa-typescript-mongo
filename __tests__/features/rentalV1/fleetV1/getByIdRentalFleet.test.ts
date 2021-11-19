/* eslint-disable @typescript-eslint/naming-convention */
import request from 'supertest';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import { checkDefaultRentalFleetFormat } from '../../../utils/formats/RentalFleetFormat';
import app from '../../../../src/app';
import factory from '../../../utils/factorys/RentalFleetFactory';
import checkDefaultErrorFormat from '../../../utils/formats/ErrorFormat';
import { RENTALFLEETPREFIX } from '../../../utils/Constants';

describe('src :: api :: controllers :: rental :: fleet :: getById', () => {
  describe('GIVEN a GET by ID of a fleet car from a rental company', () => {
    describe('WHEN there is a car with the especified id and idFleet', () => {
      let response: request.Response;
      let generatedRentalFleet: RentalFleet;
      beforeEach(async () => {
        generatedRentalFleet = await factory.create<RentalFleet>('RentalFleet');
        response = await request(app).get(
          `${RENTALFLEETPREFIX.replace('{id}', generatedRentalFleet.id_locadora?.toString() as string)}/${
            generatedRentalFleet._id?.toString() as string
          }`
        );
      });

      test('THEN it should return status code 204', async () => {
        expect(response.status).toBe(200);
      });

      test('THEN it should return the especified body', async () => {
        checkDefaultRentalFleetFormat(response.body);
      });

      test('THEN it should return have a id and match the content with the entry', async () => {
        const { body } = response;
        expect(body._id).toBe(generatedRentalFleet._id?.toString());
        expect(body.id_locadora).toBe(generatedRentalFleet.id_locadora?.toString());
        expect(body.id_carro).toBe(generatedRentalFleet.id_carro?.toString());
        expect(body.placa).toBe(generatedRentalFleet.placa);
        expect(body.status).toBe(generatedRentalFleet.status);
        expect(body.valor_diaria).toBe(generatedRentalFleet.valor_diaria);
      });
    });

    describe('WHEN trying to get with a rental car that is not from the same rental company', () => {
      let response: request.Response;
      let generatedRental: RentalFleet;
      let generatedFleet: RentalFleet;
      beforeEach(async () => {
        generatedRental = await factory.create<RentalFleet>('RentalFleet');
        generatedFleet = await factory.create<RentalFleet>('RentalFleet');
        response = await request(app).get(
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

    describe('WHEN trying to get with a rental ID that is invalid', () => {
      let response: request.Response;
      beforeEach(async () => {
        response = await request(app).get(`${RENTALFLEETPREFIX.replace('{id}', '23')}/6171508962f47a7a91938d30`);
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

    describe('WHEN trying to get a car with a fleet ID that is invalid', () => {
      let response: request.Response;
      beforeEach(async () => {
        response = await request(app).get(`${RENTALFLEETPREFIX.replace('{id}', '6171508962f47a7a91938d30')}/1523`);
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

    describe('WHEN trying to get with a fleet ID that is not existent', () => {
      let response: request.Response;
      let cretedIdLocadora: string;
      beforeEach(async () => {
        const { id_locadora } = await factory.create<RentalFleet>('RentalFleet');
        response = await request(app).get(
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

    describe('WHEN trying to get with a rental company ID that is not existent', () => {
      let response: request.Response;
      let cretedIdFleet: string;
      beforeEach(async () => {
        const result = await factory.create<RentalFleet>('RentalFleet');
        response = await request(app).get(
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
