/* eslint-disable @typescript-eslint/naming-convention */
import request from 'supertest';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import { checkDefaultRentalFleetFormat } from '../../../utils/formats/RentalFleetFormat';
import app from '../../../../src/app';
import factory from '../../../utils/factorys/RentalFleetFactory';
import checkDefaultErrorFormat from '../../../utils/formats/ErrorFormat';
import { RENTALFLEETPREFIX } from '../../../utils/Constants';

describe('src :: api :: controllers :: rental :: fleet :: update', () => {
  describe('GIVEN a PUT to update a existing rental car', () => {
    describe('WHEN every validation is meth', () => {
      let response: request.Response;
      let generatedRentalFleet: RentalFleet;
      let updateRentalFleet: RentalFleet;
      beforeEach(async () => {
        generatedRentalFleet = await factory.create<RentalFleet>('RentalFleet');
        const { id_carro, status, valor_diaria, placa } = await factory.build<RentalFleet>('RentalFleet');
        updateRentalFleet = { id_carro: id_carro.toString(), status, valor_diaria, placa };
        response = await request(app)
          .put(
            `${RENTALFLEETPREFIX.replace('{id}', generatedRentalFleet.id_locadora?.toString() as string)}/${
              generatedRentalFleet._id
            }`
          )
          .send(updateRentalFleet);
      });

      test('THEN it should return status code 200', async () => {
        expect(response.status).toBe(200);
      });

      test('THEN it should return the especified body', async () => {
        checkDefaultRentalFleetFormat(response.body);
      });

      test('THEN it should return have a id and match the content with the entry', async () => {
        const { body } = response;
        expect(body._id).toBe(generatedRentalFleet._id?.toString());
        expect(body.id_locadora).toBe(generatedRentalFleet.id_locadora?.toString());
        expect(body.id_carro).toBe(updateRentalFleet.id_carro);
        expect(body.placa).toBe(updateRentalFleet.placa);
        expect(body.status).toBe(updateRentalFleet.status);
        expect(body.valor_diaria).toBe(updateRentalFleet.valor_diaria);
      });
    });

    describe('WHEN a field is missing', () => {
      let response: request.Response;
      let generatedRentalFleet: RentalFleet;
      beforeEach(async () => {
        generatedRentalFleet = await factory.create<RentalFleet>('RentalFleet');
        const { id_carro, valor_diaria, placa } = await factory.build<RentalFleet>('RentalFleet');
        response = await request(app)
          .put(
            `${RENTALFLEETPREFIX.replace('{id}', generatedRentalFleet.id_locadora?.toString() as string)}/${
              generatedRentalFleet._id
            }`
          )
          .send({ id_carro: id_carro.toString(), valor_diaria, placa });
      });

      test('THEN it should return status 400 for validation error', async () => {
        expect(response.status).toBe(400);
      });

      test('THEN it should return a body with the especified error format', async () => {
        checkDefaultErrorFormat(response.body);
      });

      test('THEN it should return a body with missing field error', async () => {
        const { body } = response;
        expect(body).toHaveLength(1);
        expect(body[0].name).toBe('"status" is required');
        expect(body[0].description).toBe('status');
      });
    });

    describe('WHEN a field is empty', () => {
      let response: request.Response;
      let generatedRentalFleet: RentalFleet;
      beforeEach(async () => {
        generatedRentalFleet = await factory.create<RentalFleet>('RentalFleet');
        const { id_carro, valor_diaria, placa, status } = await factory.build<RentalFleet>('RentalFleet', {
          status: '    '
        });
        response = await request(app)
          .put(
            `${RENTALFLEETPREFIX.replace('{id}', generatedRentalFleet.id_locadora?.toString() as string)}/${
              generatedRentalFleet._id
            }`
          )
          .send({ id_carro: id_carro.toString(), valor_diaria, placa, status });
      });

      test('THEN it should return status 400 for validation error', async () => {
        expect(response.status).toBe(400);
      });

      test('THEN it should return a body with the especified error format', async () => {
        checkDefaultErrorFormat(response.body);
      });

      test('THEN it should return a body with empty field error', async () => {
        const { body } = response;
        expect(body).toHaveLength(2);
        expect(body[0].name).toBe('"status" must be one of [disponível, indisponível]');
        expect(body[0].description).toBe('status');
        expect(body[1].name).toBe('"status" is not allowed to be empty');
        expect(body[1].description).toBe('status');
      });
    });

    describe('WHEN a plate is already used by another rental company', () => {
      let response: request.Response;
      beforeEach(async () => {
        await factory.create<RentalFleet>('RentalFleet', { placa: 'KFA0205' });
        const generatedRentalFleet = await factory.create<RentalFleet>('RentalFleet');
        const { id_carro, status, valor_diaria, placa } = await factory.build<RentalFleet>('RentalFleet', {
          placa: 'KFA0205'
        });
        response = await request(app)
          .put(
            `${RENTALFLEETPREFIX.replace('{id}', generatedRentalFleet.id_locadora?.toString() as string)}/${
              generatedRentalFleet._id
            }`
          )
          .send({ id_carro, status, valor_diaria, placa });
      });

      test('THEN it should return status 400 for validation error', async () => {
        expect(response.status).toBe(400);
      });

      test('THEN it should return a body with the especified error format', async () => {
        checkDefaultErrorFormat(response.body);
      });

      test('THEN it should return a body with invalid plate error', async () => {
        const { body } = response;
        expect(body).toHaveLength(1);
        expect(body[0].name).toBe('placa KFA0205 already in use');
        expect(body[0].description).toBe('Conflict');
      });
    });

    describe('WHEN a rental id is invalid', () => {
      let response: request.Response;
      beforeEach(async () => {
        const result = await factory.create<RentalFleet>('RentalFleet');
        const { id_carro, status, valor_diaria, placa } = await factory.build<RentalFleet>('RentalFleet');
        response = await request(app)
          .put(`${RENTALFLEETPREFIX.replace('{id}', '23')}/${result._id?.toString()}`)
          .send({ id_carro, status, valor_diaria, placa });
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

    describe('WHEN a fleet id is invalid', () => {
      let response: request.Response;
      beforeEach(async () => {
        const result = await factory.create<RentalFleet>('RentalFleet');
        const { id_carro, status, valor_diaria, placa } = await factory.build<RentalFleet>('RentalFleet');
        response = await request(app)
          .put(`${RENTALFLEETPREFIX.replace('{id}', result.id_locadora?.toString() as string)}/1523`)
          .send({ id_carro, status, valor_diaria, placa });
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

    describe('WHEN a fleet id is not existent', () => {
      let response: request.Response;
      let cretedIdLocadora: string;
      beforeEach(async () => {
        const { id_locadora } = await factory.create<RentalFleet>('RentalFleet');
        const { id_carro, status, valor_diaria, placa } = await factory.build<RentalFleet>('RentalFleet');
        response = await request(app)
          .put(`${RENTALFLEETPREFIX.replace('{id}', id_locadora?.toString() as string)}/6171508962f47a7a91938d30`)
          .send({ id_carro, status, valor_diaria, placa });
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

    describe('WHEN a rental company id is not existent', () => {
      let response: request.Response;
      let cretedIdFleet: string;
      beforeEach(async () => {
        const result = await factory.create<RentalFleet>('RentalFleet');
        const { id_carro, status, valor_diaria, placa } = await factory.build<RentalFleet>('RentalFleet');
        response = await request(app)
          .put(`${RENTALFLEETPREFIX.replace('{id}', '6171508962f47a7a91938d30')}/${result._id?.toString()}`)
          .send({ id_carro, status, valor_diaria, placa });
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
