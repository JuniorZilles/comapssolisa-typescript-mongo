import NotFound from '@errors/NotFound';
import RentalReserveService from '@services/rental/reserve';
import { RentalReserve } from '@interfaces/rental/reserve/RentalReserve';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import factory from '../../../utils/factorys/RentalReserveFactory';
import fleetFactory from '../../../utils/factorys/RentalFleetFactory';

describe('src :: api :: services :: rental :: reserve :: delete', () => {
  describe('GIVEN a call to delete a reservation', () => {
    describe('WHEN there is a reserve with the especified id and idReserve', () => {
      let generatedRentalReserve: RentalReserve;
      let deleted: RentalReserve;
      beforeEach(async () => {
        const fleetInfo = await fleetFactory.create<RentalFleet>('RentalFleet');
        generatedRentalReserve = await factory.create<RentalReserve>('RentalReserve', {
          id_locadora: fleetInfo.id_locadora?.toString() as string,
          id_carro: fleetInfo.id_carro?.toString() as string
        });
        deleted = await RentalReserveService.delete(
          generatedRentalReserve.id_locadora?.toString() as string,
          generatedRentalReserve._id?.toString() as string
        );
      });

      test('THEN it should return the removed register', async () => {
        expect(deleted._id).toEqual(generatedRentalReserve._id);
        expect(deleted.id_carro).toEqual(generatedRentalReserve.id_carro);
        expect(deleted.id_locadora).toEqual(generatedRentalReserve.id_locadora);
        expect(deleted.data_fim).toEqual(generatedRentalReserve.data_fim);
        expect(deleted.data_inicio).toEqual(generatedRentalReserve.data_inicio);
        expect(deleted.id_user).toEqual(generatedRentalReserve.id_user);
        expect(deleted.valor_final).toEqual(generatedRentalReserve.valor_final);
      });
    });

    describe('WHEN there is no reserve with the especified idReserve', () => {
      let generatedRentalReserve: RentalReserve;
      beforeEach(async () => {
        generatedRentalReserve = await factory.create<RentalReserve>('RentalReserve');
      });

      test('THEN it should throw a not found error', async () => {
        try {
          await RentalReserveService.delete(
            generatedRentalReserve.id_locadora?.toString() as string,
            '6171508962f47a7a91938d30'
          );
        } catch (e) {
          expect(e).toBeInstanceOf(NotFound);
          expect((<NotFound>e).description).toBe('Not Found');
          expect((<NotFound>e).name).toBe(
            `Value id: ${
              generatedRentalReserve.id_locadora?.toString() as string
            } - idReserve: 6171508962f47a7a91938d30 not found`
          );
        }
      });
    });

    describe('WHEN there is no rental id that matches the the especified idReserve', () => {
      let generatedRentalReserve: RentalReserve;
      beforeEach(async () => {
        generatedRentalReserve = await factory.create<RentalReserve>('RentalReserve');
      });

      test('THEN it should throw a not found error', async () => {
        try {
          await RentalReserveService.delete(
            '6171508962f47a7a91938d30',
            generatedRentalReserve._id?.toString() as string
          );
        } catch (e) {
          expect(e).toBeInstanceOf(NotFound);
          expect((<NotFound>e).description).toBe('Not Found');
          expect((<NotFound>e).name).toBe(
            `Value id: 6171508962f47a7a91938d30 - idReserve: ${
              generatedRentalReserve._id?.toString() as string
            } not found`
          );
        }
      });
    });

    describe('WHEN trying to remove a reserve that is not from the rental company', () => {
      let generatedRental: RentalReserve;
      let generatedRentalReserve: RentalReserve;
      beforeEach(async () => {
        generatedRental = await factory.create<RentalReserve>('RentalReserve');
        generatedRentalReserve = await factory.create<RentalReserve>('RentalReserve');
      });

      test('THEN it should throw a not found error', async () => {
        try {
          await RentalReserveService.delete(
            generatedRental.id_locadora?.toString() as string,
            generatedRentalReserve._id?.toString() as string
          );
        } catch (e) {
          expect(e).toBeInstanceOf(NotFound);
          expect((<NotFound>e).description).toBe('Not Found');
          expect((<NotFound>e).name).toBe(
            `Value id: ${generatedRental.id_locadora?.toString() as string} - idReserve: ${
              generatedRentalReserve._id?.toString() as string
            } not found`
          );
        }
      });
    });
  });
});
