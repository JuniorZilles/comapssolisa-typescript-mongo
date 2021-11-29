/* eslint-disable @typescript-eslint/naming-convention */
import request from 'supertest';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import app from '../../../../src/app';
import factory from '../../../utils/factorys/RentalFleetFactory';
import checkDefaultErrorFormat from '../../../utils/formats/ErrorFormat';
import { RENTALFLEETPREFIX } from '../../../utils/Constants';
import { checkDefaultRentalFleetFormat } from '../../../utils/formats/RentalFleetFormat';

describe('src :: api :: controllers :: rental :: fleet :: create', () => {
  describe('GIVEN a POST to create a new rental car', () => {
    describe('WHEN every validation is meth', () => {
      let response: request.Response;
      let generatedRentalFleet: RentalFleet;
      beforeEach(async () => {
        const { id_locadora, id_carro, status, valor_diaria, placa } = await factory.build<RentalFleet>('RentalFleet');
        const value = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(valor_diaria as number);
        generatedRentalFleet = { id_carro: id_carro.toString(), status, valor_diaria: value, placa };
        response = await request(app)
          .post(RENTALFLEETPREFIX.replace('{id}', id_locadora?.toString() as string))
          .send(generatedRentalFleet);
      });
      test('THEN it should return status code 201', async () => {
        expect(response.status).toBe(201);
      });
      test('THEN it should return the especified body', async () => {
        checkDefaultRentalFleetFormat(response.body);
      });
      test('THEN it should return have a id and match the content with the entry', async () => {
        const { body } = response;
        expect(body._id).toBeDefined();
        expect(body.id_carro).toBe(generatedRentalFleet.id_carro);
        expect(body.placa).toBe(generatedRentalFleet.placa);
        expect(body.status).toBe(generatedRentalFleet.status);
        expect(body.valor_diaria).toBe(generatedRentalFleet.valor_diaria);
      });
    });

    describe('WHEN a field is missing', () => {
      let response: request.Response;
      beforeEach(async () => {
        const { id_locadora, status, valor_diaria, placa } = await factory.build<RentalFleet>('RentalFleet');
        const value = valor_diaria?.toLocaleString('pt-BR') as string;
        response = await request(app)
          .post(RENTALFLEETPREFIX.replace('{id}', id_locadora?.toString() as string))
          .send({ status, valor_diaria: value, placa });
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
        expect(body[0].name).toBe('"id_carro" is required');
        expect(body[0].description).toBe('id_carro');
      });
    });

    describe('WHEN a field is empty', () => {
      let response: request.Response;
      beforeEach(async () => {
        const { id_locadora, id_carro, status, valor_diaria, placa } = await factory.build<RentalFleet>('RentalFleet', {
          placa: '    '
        });
        const value = valor_diaria?.toLocaleString('pt-BR') as string;
        response = await request(app)
          .post(RENTALFLEETPREFIX.replace('{id}', id_locadora?.toString() as string))
          .send({ id_carro, status, valor_diaria: value, placa });
      });
      test('THEN it should return status 400 for validation error', async () => {
        expect(response.status).toBe(400);
      });
      test('THEN it should return a body with the especified error format', async () => {
        checkDefaultErrorFormat(response.body);
      });
      test('THEN it should return a body with empty field error', async () => {
        const { body } = response;
        expect(body).toHaveLength(1);
        expect(body[0].name).toBe('"placa" is not allowed to be empty');
        expect(body[0].description).toBe('placa');
      });
    });

    describe('WHEN a plate is already used by another rental company', () => {
      let response: request.Response;
      beforeEach(async () => {
        await factory.create<RentalFleet>('RentalFleet', { placa: 'KFA0205' });
        const { id_locadora, id_carro, status, valor_diaria, placa } = await factory.build<RentalFleet>('RentalFleet', {
          placa: 'KFA0205'
        });
        const value = valor_diaria?.toLocaleString('pt-BR') as string;
        response = await request(app)
          .post(RENTALFLEETPREFIX.replace('{id}', id_locadora?.toString() as string))
          .send({ id_carro, status, valor_diaria: value, placa });
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
        const value = valor_diaria?.toLocaleString('pt-BR') as string;
        response = await request(app)
          .put(`${RENTALFLEETPREFIX.replace('{id}', '23')}/${result._id?.toString()}`)
          .send({ id_carro, status, valor_diaria: value, placa });
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
  });
});
