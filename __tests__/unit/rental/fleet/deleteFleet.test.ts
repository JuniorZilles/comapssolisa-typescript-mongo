import NotFound from '@errors/NotFound';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import RentalFleetService from '@services/rental/fleet';
import factory from '../../../utils/factorys/RentalFleetFactory';

describe('src :: api :: services :: rental :: car :: delete', () => {
  describe('GIVEN a call to delete a rental car', () => {
    describe('WHEN there is a car with the especified id and idFleet', () => {
      let generatedRentalFleet: RentalFleet;
      let deleted: RentalFleet;
      beforeEach(async () => {
        generatedRentalFleet = await factory.create<RentalFleet>('RentalFleet');
        deleted = await RentalFleetService.delete(
          generatedRentalFleet.id_locadora?.toString() as string,
          generatedRentalFleet._id?.toString() as string
        );
      });

      test('THEN it should return the removed register', async () => {
        expect(deleted._id).toEqual(generatedRentalFleet._id);
        expect(deleted.id_carro).toEqual(generatedRentalFleet.id_carro);
        expect(deleted.id_locadora).toEqual(generatedRentalFleet.id_locadora);
        expect(deleted.placa).toEqual(generatedRentalFleet.placa);
        expect(deleted.status).toEqual(generatedRentalFleet.status);
        expect(deleted.valor_diaria).toEqual(generatedRentalFleet.valor_diaria);
      });
    });

    describe('WHEN there is no rental car with the especified idFleet', () => {
      let generatedRentalFleet: RentalFleet;
      beforeEach(async () => {
        generatedRentalFleet = await factory.create<RentalFleet>('RentalFleet');
      });

      test('THEN it should throw a not found error', async () => {
        try {
          await RentalFleetService.delete(
            generatedRentalFleet.id_locadora?.toString() as string,
            '6171508962f47a7a91938d30'
          );
        } catch (e) {
          expect(e).toBeInstanceOf(NotFound);
          expect((<NotFound>e).description).toBe('Not Found');
          expect((<NotFound>e).name).toBe(
            `Value id: ${
              generatedRentalFleet.id_locadora?.toString() as string
            } - idFleet: 6171508962f47a7a91938d30 not found`
          );
        }
      });
    });

    describe('WHEN there is no rental id that matches the the especified idFleet', () => {
      let generatedRentalFleet: RentalFleet;
      beforeEach(async () => {
        generatedRentalFleet = await factory.create<RentalFleet>('RentalFleet');
      });

      test('THEN it should throw a not found error', async () => {
        try {
          await RentalFleetService.delete('6171508962f47a7a91938d30', generatedRentalFleet._id?.toString() as string);
        } catch (e) {
          expect(e).toBeInstanceOf(NotFound);
          expect((<NotFound>e).description).toBe('Not Found');
          expect((<NotFound>e).name).toBe(
            `Value id: 6171508962f47a7a91938d30 - idFleet: ${generatedRentalFleet._id?.toString() as string} not found`
          );
        }
      });
    });

    describe('WHEN trying to remove a rental car that is not from the rental company', () => {
      let generatedRental: RentalFleet;
      let generatedFleet: RentalFleet;
      beforeEach(async () => {
        generatedRental = await factory.create<RentalFleet>('RentalFleet');
        generatedFleet = await factory.create<RentalFleet>('RentalFleet');
      });

      test('THEN it should throw a not found error', async () => {
        try {
          await RentalFleetService.delete(
            generatedRental.id_locadora?.toString() as string,
            generatedFleet._id?.toString() as string
          );
        } catch (e) {
          expect(e).toBeInstanceOf(NotFound);
          expect((<NotFound>e).description).toBe('Not Found');
          expect((<NotFound>e).name).toBe(
            `Value id: ${generatedRental.id_locadora?.toString() as string} - idFleet: ${
              generatedFleet._id?.toString() as string
            } not found`
          );
        }
      });
    });
  });
});
