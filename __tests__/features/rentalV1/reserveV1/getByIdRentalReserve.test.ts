/* eslint-disable @typescript-eslint/naming-convention */
import request from 'supertest';
import { RentalReserve } from '@interfaces/rental/reserve/RentalReserve';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import moment from 'moment';
import app from '../../../../src/app';
import factory from '../../../utils/factorys/RentalReserveFactory';
import fleetFactory from '../../../utils/factorys/RentalFleetFactory';
import checkDefaultErrorFormat from '../../../utils/formats/ErrorFormat';
import { RENTALRESERVEPREFIX, TOKEN } from '../../../utils/Constants';
import { checkDefaultRentalReserveFormat } from '../../../utils/formats/RentalReserveFormat';

describe('src :: api :: controllers :: rental :: reserve :: getById', () => {
  describe('GIVEN a GET by ID of a reserve from a rental company', () => {
    describe('WHEN there is a reserve with the especified id and idReserve', () => {
      let response: request.Response;
      let generatedRentalReserve: RentalReserve;
      beforeEach(async () => {
        const generateFleet = await fleetFactory.create<RentalFleet>('RentalFleet');
        const fleetInfo = {
          id_carro: generateFleet._id?.toString() as string,
          id_locadora: generateFleet.id_locadora?.toString() as string
        };
        generatedRentalReserve = await factory.create<RentalReserve>('RentalReserve', {
          id_locadora: fleetInfo.id_locadora,
          id_carro: fleetInfo.id_carro
        });
        response = await request(app)
          .get(
            `${RENTALRESERVEPREFIX.replace('{id}', generateFleet.id_locadora?.toString() as string)}/${
              generatedRentalReserve._id?.toString() as string
            }`
          )
          .set(TOKEN);
      });

      test('THEN it should return status code 204', async () => {
        expect(response.status).toBe(200);
      });

      test('THEN it should return the especified body', async () => {
        checkDefaultRentalReserveFormat(response.body);
      });

      test('THEN it should return have a id and match the content with the entry', async () => {
        const { body } = response;
        expect(body._id).toBe(generatedRentalReserve._id?.toString());
        expect(body.id_locadora).toBe(generatedRentalReserve.id_locadora?.toString());
        expect(body.id_carro).toBe(generatedRentalReserve.id_carro?.toString());
        expect(body.id_user).toBe(generatedRentalReserve.id_user?.toString());
        expect(body.data_fim).toBe(moment(generatedRentalReserve.data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'));
        expect(body.data_inicio).toBe(
          moment(generatedRentalReserve.data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
        );
        expect(body.valor_final).toBe(generatedRentalReserve.valor_final);
      });
    });

    describe('WHEN trying to get with a reserve that is not from the same rental company', () => {
      let response: request.Response;
      let generatedRental: RentalReserve;
      let generatedReserve: RentalReserve;
      beforeEach(async () => {
        generatedRental = await factory.create<RentalReserve>('RentalReserve');
        generatedReserve = await factory.create<RentalReserve>('RentalReserve');
        response = await request(app)
          .get(
            `${RENTALRESERVEPREFIX.replace('{id}', generatedRental.id_locadora?.toString() as string)}/${
              generatedReserve._id?.toString() as string
            }`
          )
          .set(TOKEN);
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
        expect(body[0].name).toBe(
          `Value id: ${generatedRental.id_locadora?.toString() as string} - idReserve: ${
            generatedReserve._id?.toString() as string
          } not found`
        );
        expect(body[0].description).toBe('Not Found');
      });
    });

    describe('WHEN trying to get with a rental ID that is invalid', () => {
      let response: request.Response;
      beforeEach(async () => {
        response = await request(app)
          .get(`${RENTALRESERVEPREFIX.replace('{id}', '23')}/6171508962f47a7a91938d30`)
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

    describe('WHEN trying to get a reserve with a reserve ID that is invalid', () => {
      let response: request.Response;
      beforeEach(async () => {
        response = await request(app)
          .get(`${RENTALRESERVEPREFIX.replace('{id}', '6171508962f47a7a91938d30')}/1523`)
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

    describe('WHEN trying to get with a reserve ID that is not existent', () => {
      let response: request.Response;
      let cretedIdLocadora: string;
      beforeEach(async () => {
        const { id_locadora } = await factory.create<RentalReserve>('RentalReserve');
        response = await request(app)
          .get(`${RENTALRESERVEPREFIX.replace('{id}', id_locadora?.toString() as string)}/6171508962f47a7a91938d30`)
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

    describe('WHEN trying to get with a rental company ID that is not existent', () => {
      let response: request.Response;
      let cretedIdReserve: string;
      beforeEach(async () => {
        const result = await factory.create<RentalReserve>('RentalReserve');
        response = await request(app)
          .get(`${RENTALRESERVEPREFIX.replace('{id}', '6171508962f47a7a91938d30')}/${result._id?.toString()}`)
          .set(TOKEN);
        cretedIdReserve = result._id?.toString() as string;
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
