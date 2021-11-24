import { Paginate } from '@interfaces/Paginate';
import { RentalReserve } from '@interfaces/rental/reserve/RentalReserve';
import RentalReserveService from '@services/rental/reserve';
import moment from 'moment';
import factory from '../../../utils/factorys/RentalReserveFactory';

describe('src :: api :: services :: rental :: reserve :: getAll', () => {
  describe('GIVEN existing reservation', () => {
    describe('WHEN searched with a field', () => {
      let getted: Paginate<RentalReserve>;
      let baseGenerated: RentalReserve;
      beforeEach(async () => {
        baseGenerated = await factory.create<RentalReserve>('RentalReserve');
        await factory.createMany<RentalReserve>('RentalReserve', 4, {
          id_carro: baseGenerated.id_carro,
          id_locadora: baseGenerated.id_locadora
        });
        // create 5 with random id_locadora to check if it will be filtered
        await factory.createMany<RentalReserve>('RentalReserve', 5, { id_carro: baseGenerated.id_carro });
        getted = await RentalReserveService.getAll(baseGenerated.id_locadora?.toString() as string, {
          id_carro: baseGenerated.id_carro.toString()
        });
      });

      test('THEN results all the reserves that have the searched field', async () => {
        expect(getted.docs).toHaveLength(5);
        getted.docs.forEach((element) => {
          expect(element.id_locadora).toEqual(baseGenerated.id_locadora);
          expect(element.id_carro).toEqual(baseGenerated.id_carro);
        });
      });
    });

    describe('WHEN searched with a date', () => {
      let getted: Paginate<RentalReserve>;
      let baseGenerated: RentalReserve;
      const iniDate = moment().add(4, 'days').format('DD/MM/YYYY');
      beforeEach(async () => {
        baseGenerated = await factory.create<RentalReserve>('RentalReserve');
        const date = moment(iniDate, 'DD/MM/YYYY');

        await factory.createMany<RentalReserve>('RentalReserve', 10, {
          id_locadora: baseGenerated.id_locadora?.toString(),
          data_inicio: date.toISOString()
        });
        getted = await RentalReserveService.getAll(baseGenerated.id_locadora?.toString() as string, {
          data_inicio: iniDate
        });
      });

      test('THEN results all reserves that start at a especific date', async () => {
        expect(getted.docs).toHaveLength(10);
        const date = moment(iniDate, 'DD/MM/YYYY').toDate();
        getted.docs.forEach((element) => {
          expect(element.id_locadora).toEqual(baseGenerated.id_locadora);
          expect(element.data_inicio).toEqual(date);
        });
      });
    });

    describe('WHEN searched all reserve using limit=5 and offset=1', () => {
      let getted: Paginate<RentalReserve>;
      let baseGenerated: RentalReserve;
      beforeEach(async () => {
        baseGenerated = await factory.create<RentalReserve>('RentalReserve');
        await factory.createMany<RentalReserve>('RentalReserve', 10, {
          id_locadora: baseGenerated.id_locadora
        });
        getted = await RentalReserveService.getAll(baseGenerated.id_locadora?.toString() as string, {
          limit: '5',
          offset: '1'
        });
      });

      test('THEN results all the 5 first reserves', async () => {
        expect(getted.docs).toHaveLength(5);
        getted.docs.forEach((element) => {
          expect(element.id_locadora).toEqual(baseGenerated.id_locadora);
        });
      });
    });

    describe('WHEN searched with a field that dont have the value', () => {
      let getted: Paginate<RentalReserve>;
      beforeEach(async () => {
        const baseGenerated = await factory.create<RentalReserve>('RentalReserve');
        await factory.createMany<RentalReserve>('RentalReserve', 4, {
          id_carro: baseGenerated.id_carro,
          id_locadora: baseGenerated.id_locadora
        });
        getted = await RentalReserveService.getAll(baseGenerated.id_locadora?.toString() as string, {
          id_carro: '6171508962f47a7a91938d30'
        });
      });

      test('THEN results 0 reserves, but with the default body', async () => {
        expect(getted.docs).toHaveLength(0);
      });
    });
  });
});
