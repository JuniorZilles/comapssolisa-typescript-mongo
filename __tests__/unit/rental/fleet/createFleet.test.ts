/* eslint-disable @typescript-eslint/naming-convention */
import InvalidValue from '@errors/InvalidValue';
import NotFound from '@errors/NotFound';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import RentalFleetService from '@services/rental/fleet';
import factory from '../../../utils/factorys/RentalFleetFactory';

describe('src :: api :: services :: rental :: car :: create', () => {
  describe('GIVEN a call to create a new rental car', () => {
    describe('WHEN every validation is meth', () => {
      let generatedRentalFleet: RentalFleet;
      let createdRentalFleet: RentalFleet;
      beforeEach(async () => {
        const { id_locadora, id_carro, status, valor_diaria, placa } = await factory.build<RentalFleet>('RentalFleet');
        const value = valor_diaria?.toLocaleString('pt-BR') as string;
        generatedRentalFleet = { id_carro: id_carro.toString() as string, status, valor_diaria: value, placa };
        createdRentalFleet = await RentalFleetService.create(id_locadora?.toString() as string, generatedRentalFleet);
      });

      test('THEN it should have a id and match the content with the entry', async () => {
        expect(createdRentalFleet._id).toBeDefined();
        expect(createdRentalFleet.id_carro.toString()).toEqual(generatedRentalFleet.id_carro);
        expect(createdRentalFleet.placa).toBe(generatedRentalFleet.placa);
        expect(createdRentalFleet.status).toBe(generatedRentalFleet.status);
        expect(createdRentalFleet.valor_diaria).toBe(generatedRentalFleet.valor_diaria);
      });
    });

    describe('WHEN placa already used by another car', () => {
      let generated: RentalFleet;
      beforeEach(async () => {
        generated = await factory.build<RentalFleet>('RentalFleet');
      });
      test('THEN should throw a invalid value', async () => {
        try {
          const { id_locadora, id_carro, status, valor_diaria, placa } = generated;
          const value = valor_diaria?.toLocaleString('pt-BR') as string;
          await RentalFleetService.create(id_locadora as string, {
            id_carro: id_carro.toString() as string,
            status,
            valor_diaria: value,
            placa
          });
        } catch (e) {
          expect(e).toBeInstanceOf(InvalidValue);
          expect((<InvalidValue>e).description).toBe('Conflict');
          expect((<InvalidValue>e).message).toBe(`placa ${generated.placa} already in use`);
        }
      });
    });

    describe('WHEN using invalid id_carro', () => {
      let generated: RentalFleet;
      beforeEach(async () => {
        generated = await factory.build<RentalFleet>('RentalFleet');
      });
      test('THEN should throw a not found error', async () => {
        try {
          const { id_locadora, status, valor_diaria, placa } = generated;
          const value = valor_diaria?.toLocaleString('pt-BR') as string;
          await RentalFleetService.create(id_locadora as string, {
            id_carro: '6171508962f47a7a91938d30',
            status,
            valor_diaria: value,
            placa
          });
        } catch (e) {
          expect(e).toBeInstanceOf(NotFound);
          expect((<NotFound>e).description).toBe('Not Found');
          expect((<NotFound>e).message).toBe('Value id_carro: 6171508962f47a7a91938d30 not found');
        }
      });
    });

    describe('WHEN using invalid id_locadora', () => {
      let generated: RentalFleet;
      beforeEach(async () => {
        generated = await factory.build<RentalFleet>('RentalFleet');
      });
      test('THEN should throw a not found error', async () => {
        try {
          const { id_carro, status, valor_diaria, placa } = generated;
          const value = valor_diaria?.toLocaleString('pt-BR') as string;
          await RentalFleetService.create('6171508962f47a7a91938d30', {
            id_carro: id_carro.toString() as string,
            status,
            valor_diaria: value,
            placa
          });
        } catch (e) {
          expect(e).toBeInstanceOf(NotFound);
          expect((<NotFound>e).description).toBe('Not Found');
          expect((<NotFound>e).message).toBe('Value id_locadora: 6171508962f47a7a91938d30 not found');
        }
      });
    });
  });
});
