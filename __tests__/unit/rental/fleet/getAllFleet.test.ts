import { Paginate } from '@interfaces/Paginate';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import RentalFleetService from '@services/rental/fleet';
import factory from '../../../utils/factorys/RentalFleetFactory';

describe('src :: api :: services :: rental :: fleet :: getAll', () => {
  describe('GIVEN existing rental car', () => {
    describe('WHEN searched with a field', () => {
      let getted: Paginate<RentalFleet>;
      let baseGenerated: RentalFleet;
      beforeEach(async () => {
        baseGenerated = await factory.create<RentalFleet>('RentalFleet', { status: 'disponível' });
        await factory.createMany<RentalFleet>('RentalFleet', 4, {
          status: 'disponível',
          id_locadora: baseGenerated.id_locadora
        });
        // create 5 with random id_locadora to check if it will be filtered
        await factory.createMany<RentalFleet>('RentalFleet', 5, { status: 'disponível' });
        getted = await RentalFleetService.getAll(baseGenerated.id_locadora?.toString() as string, {
          status: 'disponível'
        });
      });

      test('THEN results all the cars that are disponível', async () => {
        expect(getted.docs).toHaveLength(5);
        getted.docs.forEach((element) => {
          expect(element.id_locadora).toEqual(baseGenerated.id_locadora);
          expect(element.status).toBe('disponível');
        });
      });
    });

    describe('WHEN searched all cars using limit=5 and offset=1', () => {
      let getted: Paginate<RentalFleet>;
      let baseGenerated: RentalFleet;
      beforeEach(async () => {
        baseGenerated = await factory.create<RentalFleet>('RentalFleet');
        await factory.createMany<RentalFleet>('RentalFleet', 10, {
          id_locadora: baseGenerated.id_locadora
        });
        getted = await RentalFleetService.getAll(baseGenerated.id_locadora?.toString() as string, {
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
      let getted: Paginate<RentalFleet>;
      beforeEach(async () => {
        const baseGenerated = await factory.create<RentalFleet>('RentalFleet', { status: 'disponível' });
        await factory.createMany<RentalFleet>('RentalFleet', 4, {
          status: 'disponível',
          id_locadora: baseGenerated.id_locadora
        });
        getted = await RentalFleetService.getAll(baseGenerated.id_locadora?.toString() as string, {
          status: 'indisponível'
        });
      });

      test('THEN results 0 reserves, but with the default body', async () => {
        expect(getted.docs).toHaveLength(0);
      });
    });
  });
});
