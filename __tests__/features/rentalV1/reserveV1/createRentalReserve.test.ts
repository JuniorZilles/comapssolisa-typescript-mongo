/* eslint-disable @typescript-eslint/naming-convention */
import request from 'supertest';
import { RentalReserve } from '@interfaces/rental/reserve/RentalReserve';
import moment from 'moment';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import app from '../../../../src/app';
import factory from '../../../utils/factorys/RentalReserveFactory';
import fleetFactory from '../../../utils/factorys/RentalFleetFactory';
import checkDefaultErrorFormat from '../../../utils/formats/ErrorFormat';
import {
  RENTALRESERVEPREFIX,
  TOKEN,
  TOKENHOTHABILTADO,
  USERDATAHABILTADO,
  USERDATANOTHABILTADO
} from '../../../utils/Constants';
import { checkDefaultRentalReserveFormat } from '../../../utils/formats/RentalReserveFormat';

describe('src :: api :: controllers :: rental :: reserve :: create', () => {
  describe('GIVEN POST to create a reserve', () => {
    describe('WHEN every validation is meth', () => {
      let response: request.Response;
      let rentalReserve: RentalReserve;
      beforeEach(async () => {
        const { data_inicio, data_fim } = await factory.build<RentalReserve>('RentalReserve');
        const generateFleet = await fleetFactory.create<RentalFleet>('RentalFleet');
        const fleetInfo = {
          id_carro: generateFleet._id?.toString() as string,
          id_locadora: generateFleet.id_locadora?.toString() as string
        };
        const generatedRentalReserve = {
          id_carro: fleetInfo.id_carro,
          data_fim: moment(data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
          data_inicio: moment(data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
        };

        rentalReserve = { ...generatedRentalReserve, ...fleetInfo };
        response = await request(app)
          .post(`${RENTALRESERVEPREFIX.replace('{id}', fleetInfo.id_locadora)}`)
          .set(TOKEN)
          .send(generatedRentalReserve);
      });

      test('THEN it should return status code 201', async () => {
        expect(response.status).toBe(201);
      });
      test('THEN it should return the especified body', async () => {
        checkDefaultRentalReserveFormat(response.body);
      });
      test('THEN it should return have a id and match the content with the entry', async () => {
        const { body } = response;
        expect(body._id).toBeDefined();
        expect(body.id_carro).toBe(rentalReserve.id_carro);
        expect(body.data_inicio).toBe(rentalReserve.data_inicio);
        expect(body.data_fim).toBe(rentalReserve.data_fim);
        expect(body.valor_final).toBeDefined();
        expect(body.id_locadora).toBe(rentalReserve.id_locadora);
        expect(body.id_user).toBe(USERDATAHABILTADO.id);
      });
    });

    describe('WHEN user does not have habilitacao', () => {
      let response: request.Response;
      beforeEach(async () => {
        const { data_fim, data_inicio } = await factory.build<RentalReserve>('RentalReserve');
        const generateFleet = await fleetFactory.create<RentalFleet>('RentalFleet');
        const fleetInfo = {
          id_carro: generateFleet._id?.toString() as string,
          id_locadora: generateFleet.id_locadora?.toString() as string
        };
        await factory.create<RentalReserve>('RentalReserve', {
          id_carro: fleetInfo.id_carro,
          id_locadora: fleetInfo.id_locadora
        });
        response = await request(app)
          .post(`${RENTALRESERVEPREFIX.replace('{id}', fleetInfo.id_locadora)}`)
          .set(TOKENHOTHABILTADO)
          .send({
            id_carro: fleetInfo.id_carro,
            data_fim: moment(data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
            data_inicio: moment(data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
          });
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
        expect(body[0].name).toBe(`User: ${USERDATAHABILTADO.email} is not allowed to reserve a car`);
        expect(body[0].description).toBe('Bad Request');
      });
    });

    describe('WHEN trying to create a reserve for a car that is already been reserved', () => {
      let response: request.Response;
      let fleetInfo: {
        id_carro: string;
        id_locadora: string;
      };
      beforeEach(async () => {
        const { data_fim, data_inicio } = await factory.build<RentalReserve>('RentalReserve');
        const generateFleet = await fleetFactory.create<RentalFleet>('RentalFleet');
        fleetInfo = {
          id_carro: generateFleet._id?.toString() as string,
          id_locadora: generateFleet.id_locadora?.toString() as string
        };
        await factory.create<RentalReserve>('RentalReserve', {
          id_carro: fleetInfo.id_carro,
          id_locadora: fleetInfo.id_locadora
        });
        response = await request(app)
          .post(`${RENTALRESERVEPREFIX.replace('{id}', fleetInfo.id_locadora)}`)
          .set(TOKEN)
          .send({
            id_carro: fleetInfo.id_carro,
            data_fim: moment(data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
            data_inicio: moment(data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
          });
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
        expect(body[0].name).toBe(`Car: ${fleetInfo.id_carro} is already reserved in this date`);
        expect(body[0].description).toBe('Conflict');
      });
    });

    describe('WHEN a user attempts to create a reserve for a car but he already has made a reservation for that date', () => {
      let response: request.Response;
      beforeEach(async () => {
        const { data_fim, data_inicio } = await factory.build<RentalReserve>('RentalReserve');
        const generateFleet = await fleetFactory.create<RentalFleet>('RentalFleet');
        const fleetInfo = {
          id_carro: generateFleet._id?.toString() as string,
          id_locadora: generateFleet.id_locadora?.toString() as string
        };
        await factory.create<RentalReserve>('RentalReserve', {
          id_user: USERDATANOTHABILTADO.id,
          id_locadora: fleetInfo.id_locadora
        });
        response = await request(app)
          .post(`${RENTALRESERVEPREFIX.replace('{id}', fleetInfo.id_locadora)}`)
          .set(TOKEN)
          .send({
            id_carro: fleetInfo.id_carro,
            data_fim: moment(data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
            data_inicio: moment(data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
          });
      });

      test('THEN it should return status 400 for validation error', async () => {
        expect(response.status).toBe(400);
      });

      test('THEN it should return a body with the especified error format', async () => {
        checkDefaultErrorFormat(response.body);
      });

      test('THEN it should return a body with invalid error', async () => {
        const { body } = response;
        expect(body).toHaveLength(1);
        expect(body[0].name).toBe(`User: ${USERDATANOTHABILTADO.id} is already reserved in this date`);
        expect(body[0].description).toBe('Conflict');
      });
    });

    describe('WHEN a user attempts to create a reserve with finish date bigger than ini date', () => {
      let response: request.Response;
      beforeEach(async () => {
        const generateFleet = await fleetFactory.create<RentalFleet>('RentalFleet');
        const fleetInfo = {
          id_carro: generateFleet._id?.toString() as string,
          id_locadora: generateFleet.id_locadora?.toString() as string
        };
        const { data_fim, data_inicio } = await factory.build<RentalReserve>('RentalReserve', {
          id_locadora: fleetInfo.id_locadora,
          id_carro: fleetInfo.id_carro,
          data_fim: moment().format('YYYY-MM-DD HH:mm:ss'),
          data_inicio: moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
        });
        response = await request(app)
          .post(`${RENTALRESERVEPREFIX.replace('{id}', fleetInfo.id_locadora)}`)
          .set(TOKEN)
          .send({
            id_carro: fleetInfo.id_carro,
            data_fim: moment(data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
            data_inicio: moment(data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
          });
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
        expect(body[0].name).toBe('The field data_inicio should be before data_fim');
        expect(body[0].description).toBe('data_inicio');
      });
    });

    describe('WHEN using nonexistant id_carro', () => {
      let response: request.Response;
      beforeEach(async () => {
        const { data_fim, data_inicio, id_locadora } = await factory.build<RentalReserve>('RentalReserve');
        response = await request(app)
          .post(`${RENTALRESERVEPREFIX.replace('{id}', id_locadora?.toString() as string)}`)
          .set(TOKEN)
          .send({
            id_carro: '6171508962f47a7a91938d30',
            data_fim: moment(data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
            data_inicio: moment(data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
          });
      });

      test('THEN it should return status 404 for not found error', async () => {
        expect(response.status).toBe(404);
      });

      test('THEN it should return a body with the especified error format', async () => {
        checkDefaultErrorFormat(response.body);
      });

      test('THEN it should return a body with missing field error', async () => {
        const { body } = response;
        expect(body).toHaveLength(1);
        expect(body[0].name).toBe('Value id_carro: 6171508962f47a7a91938d30 not found');
        expect(body[0].description).toBe('Not Found');
      });
    });

    describe('WHEN using nonexistant id_locadora', () => {
      let response: request.Response;
      beforeEach(async () => {
        const { data_fim, data_inicio, id_carro } = await factory.build<RentalReserve>('RentalReserve');
        response = await request(app)
          .post(`${RENTALRESERVEPREFIX.replace('{id}', '6171508962f47a7a91938d30')}`)
          .set(TOKEN)
          .send({
            id_carro: id_carro.toString() as string,
            data_fim: moment(data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
            data_inicio: moment(data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
          });
      });

      test('THEN it should return status 404 for not found error', async () => {
        expect(response.status).toBe(404);
      });

      test('THEN it should return a body with the especified error format', async () => {
        checkDefaultErrorFormat(response.body);
      });

      test('THEN it should return a body with missing field error', async () => {
        const { body } = response;
        expect(body).toHaveLength(1);
        expect(body[0].name).toBe('Value id_locadora: 6171508962f47a7a91938d30 not found');
        expect(body[0].description).toBe('Not Found');
      });
    });

    describe('WHEN a field is missing', () => {
      let response: request.Response;
      beforeEach(async () => {
        const { data_fim, data_inicio, id_locadora } = await factory.build<RentalReserve>('RentalReserve');
        response = await request(app)
          .post(`${RENTALRESERVEPREFIX.replace('{id}', id_locadora?.toString() as string)}`)
          .set(TOKEN)
          .send({
            data_fim: moment(data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
            data_inicio: moment(data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
          });
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
        const { data_fim, data_inicio, id_locadora } = await factory.build<RentalReserve>('RentalReserve');
        response = await request(app)
          .post(`${RENTALRESERVEPREFIX.replace('{id}', id_locadora?.toString() as string)}`)
          .set(TOKEN)
          .send({
            id_carro: '    ',
            data_fim: moment(data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
            data_inicio: moment(data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
          });
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
        expect(body[0].name).toBe('"id_carro" is not allowed to be empty');
        expect(body[0].description).toBe('id_carro');
      });
    });

    describe('WHEN a rental id is invalid', () => {
      let response: request.Response;
      beforeEach(async () => {
        const { data_fim, data_inicio, id_carro } = await factory.build<RentalReserve>('RentalReserve');
        response = await request(app)
          .post(`${RENTALRESERVEPREFIX.replace('{id}', '23')}`)
          .set(TOKEN)
          .send({
            id_carro: id_carro.toString() as string,
            data_fim: moment(data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
            data_inicio: moment(data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
          });
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
