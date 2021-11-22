/* eslint-disable @typescript-eslint/naming-convention */
import InvalidValue from '@errors/InvalidValue';
import NotFound from '@errors/NotFound';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import RentalFleetService from '@services/rental/fleet';
import factory from '../../../utils/factorys/RentalFleetFactory';

describe('src :: api :: services :: rental :: fleet :: update', () => {
  describe('GIVEN a call to update a existing rental car', () => {
    describe('WHEN every validation is meth', () => {
      let generatedRentalFleet: RentalFleet;
      let updatedRentalFleet: RentalFleet;
      beforeEach(async () => {
        const result = await factory.create<RentalFleet>('RentalFleet');
        const { id_carro, status, valor_diaria, placa } = await factory.build<RentalFleet>('RentalFleet');
        generatedRentalFleet = { id_carro: id_carro.toString() as string, status, valor_diaria, placa };
        updatedRentalFleet = await RentalFleetService.update(
          result.id_locadora?.toString() as string,
          result._id?.toString() as string,
          generatedRentalFleet
        );
        generatedRentalFleet = { _id: result._id, id_locadora: result.id_locadora, ...generatedRentalFleet };
      });

      test('THEN it should have a id and match the content with the entry', async () => {
        expect(updatedRentalFleet._id).toEqual(generatedRentalFleet._id);
        expect(updatedRentalFleet.id_locadora?.toString()).toEqual(generatedRentalFleet.id_locadora);
        expect(updatedRentalFleet.id_carro.toString()).toEqual(generatedRentalFleet.id_carro);
        expect(updatedRentalFleet.placa).toBe(generatedRentalFleet.placa);
        expect(updatedRentalFleet.status).toBe(generatedRentalFleet.status);
        expect(updatedRentalFleet.valor_diaria).toBe(generatedRentalFleet.valor_diaria);
      });
    });

    describe('WHEN placa already used by another car', () => {
      let generatedRentalFleet: RentalFleet;
      let updatedRentalFleet: RentalFleet;
      beforeEach(async () => {
        const result = await factory.create<RentalFleet>('RentalFleet', { placa: 'AAA-1111' });
        const { id_locadora, id_carro, status, valor_diaria, placa } = await factory.build<RentalFleet>('RentalFleet', {
          placa: 'AAA-1111'
        });
        updatedRentalFleet = { id_carro: id_carro.toString() as string, status, valor_diaria, placa };

        generatedRentalFleet = { _id: result._id, id_locadora, ...updatedRentalFleet };
      });

      test('THEN should throw a invalid value', async () => {
        try {
          updatedRentalFleet = await RentalFleetService.update(
            generatedRentalFleet.id_locadora?.toString() as string,
            generatedRentalFleet._id?.toString() as string,
            updatedRentalFleet
          );
        } catch (e) {
          expect(e).toBeInstanceOf(InvalidValue);
          expect((<InvalidValue>e).description).toBe('Conflict');
          expect((<InvalidValue>e).message).toBe(`placa ${updatedRentalFleet.placa} already in use`);
        }
      });
    });

    describe('WHEN  called to remove with a nonexistent fleet ID', () => {
      let id: string;
      let updatedRentalFleet: RentalFleet;
      beforeEach(async () => {
        const { id_locadora, id_carro, status, valor_diaria, placa } = await factory.build<RentalFleet>('RentalFleet');
        id = id_locadora?.toString() as string;
        updatedRentalFleet = { id_carro: id_carro.toString() as string, status, valor_diaria, placa };
      });
      test('THEN throws a not found error', async () => {
        try {
          await RentalFleetService.update(id, '6171508962f47a7a91938d30', updatedRentalFleet);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFound);
          expect((<NotFound>e).description).toBe('Not Found');
          expect((<NotFound>e).name).toBe(`Value id: ${id} - idFleet: 6171508962f47a7a91938d30 not found`);
        }
      });
    });

    describe('WHEN  called to remove with a nonexistent rental ID', () => {
      let idFleet: string;
      let updatedRentalFleet: RentalFleet;
      beforeEach(async () => {
        const result = await factory.create<RentalFleet>('RentalFleet', { placa: 'AAA-1111' });
        const { id_carro, status, valor_diaria, placa } = await factory.build<RentalFleet>('RentalFleet');
        idFleet = result.id_locadora?.toString() as string;
        updatedRentalFleet = { id_carro: id_carro.toString() as string, status, valor_diaria, placa };
      });
      test('THEN throws a not found error', async () => {
        try {
          await RentalFleetService.update('6171508962f47a7a91938d30', idFleet, updatedRentalFleet);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFound);
          expect((<NotFound>e).description).toBe('Not Found');
          expect((<NotFound>e).name).toBe(`Value id: 6171508962f47a7a91938d30 - idFleet: ${idFleet} not found`);
        }
      });
    });
  });
});
