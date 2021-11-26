import NotFound from '@errors/NotFound';
import { RentalReserve } from '@interfaces/rental/reserve/RentalReserve';
import RentalReserveService from '@services/rental/reserve';
import factory from '../../../utils/factorys/RentalReserveFactory';

describe('src :: api :: services :: rental :: reserve :: getById', () => {
  describe('GIVEN a call to getById a rental car', () => {
    describe('WHEN there is a car with the especified id and idReserve', () => {
      let generatedRentalReserve: RentalReserve;
      let getedReserve: RentalReserve;
      beforeEach(async () => {
        generatedRentalReserve = await factory.create<RentalReserve>('RentalReserve');
        getedReserve = await RentalReserveService.getById(
          generatedRentalReserve.id_locadora?.toString() as string,
          generatedRentalReserve._id?.toString() as string
        );
      });

      test('THEN it should return the requested car', async () => {
        expect(getedReserve._id).toEqual(generatedRentalReserve._id);
        expect(getedReserve.id_carro).toEqual(generatedRentalReserve.id_carro);
        expect(getedReserve.id_locadora).toEqual(generatedRentalReserve.id_locadora);
        expect(getedReserve.data_fim).toEqual(generatedRentalReserve.data_fim);
        expect(getedReserve.data_inicio).toEqual(generatedRentalReserve.data_inicio);
        expect(getedReserve.valor_final).toEqual(generatedRentalReserve.valor_final);
        expect(getedReserve.id_user).toEqual(generatedRentalReserve.id_user);
      });
    });

    describe('WHEN there is no rental car with the especified idReserve', () => {
      let generatedRentalReserve: RentalReserve;
      beforeEach(async () => {
        generatedRentalReserve = await factory.create<RentalReserve>('RentalReserve');
      });

      test('THEN it should throw a not found error', async () => {
        try {
          await RentalReserveService.getById(
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
          await RentalReserveService.getById(
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

    describe('WHEN trying to remove a rental car that is not from the rental company', () => {
      let generatedRental: RentalReserve;
      let generatedReserve: RentalReserve;
      beforeEach(async () => {
        generatedRental = await factory.create<RentalReserve>('RentalReserve');
        generatedReserve = await factory.create<RentalReserve>('RentalReserve');
      });

      test('THEN it should throw a not found error', async () => {
        try {
          await RentalReserveService.getById(
            generatedRental.id_locadora?.toString() as string,
            generatedReserve._id?.toString() as string
          );
        } catch (e) {
          expect(e).toBeInstanceOf(NotFound);
          expect((<NotFound>e).description).toBe('Not Found');
          expect((<NotFound>e).name).toBe(
            `Value id: ${generatedRental.id_locadora?.toString() as string} - idReserve: ${
              generatedReserve._id?.toString() as string
            } not found`
          );
        }
      });
    });
  });
});
