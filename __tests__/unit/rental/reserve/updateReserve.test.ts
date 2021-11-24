/* eslint-disable @typescript-eslint/naming-convention */
import InvalidValue from '@errors/InvalidValue';
import NotFound from '@errors/NotFound';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import { RentalReserve } from '@interfaces/rental/reserve/RentalReserve';
import RentalReserveService from '@services/rental/reserve';
import moment from 'moment';
import factory from '../../../utils/factorys/RentalReserveFactory';
import fleetFactory from '../../../utils/factorys/RentalFleetFactory';

describe('src :: api :: services :: rental :: reserve :: update', () => {
  describe('GIVEN a call to update a reservation', () => {
    describe('WHEN every validation is meth', () => {
      let generatedRentalReserve: RentalReserve;
      let updated: RentalReserve;
      beforeEach(async () => {
        const { data_inicio, data_fim, id_user } = await factory.build<RentalReserve>('RentalReserve');
        const generateFleet = await fleetFactory.create<RentalFleet>('RentalFleet');
        const fleetInfo = {
          id_carro: generateFleet._id?.toString() as string,
          id_locadora: generateFleet.id_locadora?.toString() as string
        };
        const { _id } = await factory.create<RentalReserve>('RentalReserve', {
          id_locadora: fleetInfo.id_locadora,
          id_user: id_user?.toString() as string
        });
        generatedRentalReserve = {
          id_carro: fleetInfo.id_carro,
          data_fim: moment(data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
          data_inicio: moment(data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
        };
        updated = await RentalReserveService.update(
          fleetInfo.id_locadora,
          _id?.toString() as string,
          generatedRentalReserve,
          {
            id: id_user?.toString() as string,
            email: 'mail@mail.com',
            habilitado: 'sim'
          }
        );
      });

      test('THEN it should have a id and match the content with the entry', async () => {
        expect(updated._id).toBeDefined();
        expect(updated.id_carro.toString()).toEqual(generatedRentalReserve.id_carro);
        expect(updated.data_fim).toEqual(generatedRentalReserve.data_fim);
        expect(updated.data_inicio).toEqual(generatedRentalReserve.data_inicio);
        expect(updated.id_user?.toString()).toBe(generatedRentalReserve.id_user);
        expect(updated.id_locadora?.toString()).toBe(generatedRentalReserve.id_locadora);
      });
    });

    describe('WHEN user does not have habilitacao', () => {
      let id_locadora: string;
      let idReserva: string;
      let user: string;
      let generatedRentalReserve: RentalReserve;
      beforeEach(async () => {
        const { data_inicio, data_fim, id_user } = await factory.build<RentalReserve>('RentalReserve');
        const generateFleet = await fleetFactory.create<RentalFleet>('RentalFleet');
        const fleetInfo = {
          id_carro: generateFleet._id?.toString() as string,
          id_locadora: generateFleet.id_locadora?.toString() as string
        };
        const { _id } = await factory.create<RentalReserve>('RentalReserve', {
          id_locadora: fleetInfo.id_locadora,
          id_user: id_user?.toString() as string
        });
        idReserva = _id?.toString() as string;
        user = id_user?.toString() as string;
        id_locadora = fleetInfo.id_locadora;
        generatedRentalReserve = {
          id_carro: fleetInfo.id_carro,
          data_fim: moment(data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
          data_inicio: moment(data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
        };
      });

      test('THEN should throw a invalid value', async () => {
        try {
          await RentalReserveService.update(id_locadora, idReserva, generatedRentalReserve, {
            id: user?.toString() as string,
            email: 'mail@mail.com',
            habilitado: 'não'
          });
        } catch (e) {
          expect(e).toBeInstanceOf(InvalidValue);
          expect((<InvalidValue>e).description).toBe('Bad Request');
          expect((<InvalidValue>e).message).toBe(`User: mail@mail.com is not allowed to reserve a car`);
        }
      });
    });

    describe('WHEN trying to update a reserve for a car that is already been reserved', () => {
      let id_locadora: string;
      let idReserva: string;
      let user: string;
      let generatedRentalReserve: RentalReserve;
      beforeEach(async () => {
        const { data_inicio, data_fim, id_user } = await factory.build<RentalReserve>('RentalReserve');
        const generateFleet = await fleetFactory.create<RentalFleet>('RentalFleet');
        const fleetInfo = {
          id_carro: generateFleet._id?.toString() as string,
          id_locadora: generateFleet.id_locadora?.toString() as string
        };
        const { _id } = await factory.create<RentalReserve>('RentalReserve', {
          id_locadora: fleetInfo.id_locadora,
          id_user: id_user?.toString() as string
        });
        await factory.create<RentalReserve>('RentalReserve', {
          id_carro: fleetInfo.id_carro,
          id_locadora: fleetInfo.id_locadora
        });
        idReserva = _id?.toString() as string;
        user = id_user?.toString() as string;
        id_locadora = fleetInfo.id_locadora;
        generatedRentalReserve = {
          id_carro: fleetInfo.id_carro,
          data_fim: moment(data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
          data_inicio: moment(data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
        };
      });

      test('THEN should throw a invalid value', async () => {
        try {
          await RentalReserveService.update(id_locadora, idReserva, generatedRentalReserve, {
            id: user?.toString() as string,
            email: 'mail@mail.com',
            habilitado: 'sim'
          });
        } catch (e) {
          expect(e).toBeInstanceOf(InvalidValue);
          expect((<InvalidValue>e).description).toBe('Conflict');
          expect((<InvalidValue>e).message).toBe(
            `Car: ${generatedRentalReserve.id_carro} is already reserved in this date`
          );
        }
      });
    });

    describe('WHEN a user attempts to update a reserve for a car but he already has made a reservation for that date', () => {
      let id_locadora: string;
      let idReserva: string;
      let user: string;
      let generatedRentalReserve: RentalReserve;
      beforeEach(async () => {
        const { data_inicio, data_fim, id_user } = await factory.build<RentalReserve>('RentalReserve');
        const generateFleet = await fleetFactory.create<RentalFleet>('RentalFleet');
        const fleetInfo = {
          id_carro: generateFleet._id?.toString() as string,
          id_locadora: generateFleet.id_locadora?.toString() as string
        };
        const { _id } = await factory.create<RentalReserve>('RentalReserve', {
          id_locadora: fleetInfo.id_locadora,
          id_user: id_user?.toString() as string
        });
        await factory.create<RentalReserve>('RentalReserve', {
          id_user: id_user?.toString() as string,
          id_locadora: fleetInfo.id_locadora
        });
        idReserva = _id?.toString() as string;
        user = id_user?.toString() as string;
        id_locadora = fleetInfo.id_locadora;
        generatedRentalReserve = {
          id_carro: fleetInfo.id_carro,
          data_fim: moment(data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
          data_inicio: moment(data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
        };
      });

      test('THEN should throw a invalid value', async () => {
        try {
          await RentalReserveService.update(id_locadora as string, idReserva, generatedRentalReserve, {
            id: user?.toString() as string,
            email: 'mail@mail.com',
            habilitado: 'sim'
          });
        } catch (e) {
          expect(e).toBeInstanceOf(InvalidValue);
          expect((<InvalidValue>e).description).toBe('Conflict');
          expect((<InvalidValue>e).message).toBe(
            `User: ${user?.toString() as string} is already reserved in this date`
          );
        }
      });
    });

    describe('WHEN a user attempts to update a reserve with finish date bigger than ini date', () => {
      let generated: RentalReserve;
      beforeEach(async () => {
        generated = await factory.build<RentalReserve>('RentalReserve', {
          data_fim: moment().format('YYYY-MM-DD HH:mm:ss'),
          data_inicio: moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
        });
      });

      test('THEN should throw a invalid value', async () => {
        try {
          const { data_fim, data_inicio, id_user } = generated;
          const generateFleet = await fleetFactory.create<RentalFleet>('RentalFleet');
          const fleetInfo = {
            id_carro: generateFleet._id?.toString() as string,
            id_locadora: generateFleet.id_locadora?.toString() as string
          };
          await RentalReserveService.update(
            fleetInfo.id_locadora as string,
            '6171508962f47a7a91938d30',
            {
              id_carro: fleetInfo.id_carro.toString() as string,
              data_fim: moment(data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
              data_inicio: moment(data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
            },
            { id: id_user?.toString() as string, email: 'mail@mail.com', habilitado: 'sim' }
          );
        } catch (e) {
          expect(e).toBeInstanceOf(InvalidValue);
          expect((<InvalidValue>e).description).toBe('data_inicio');
          expect((<InvalidValue>e).message).toBe(`The field data_inicio should be before data_fim`);
        }
      });
    });

    describe('WHEN using nonexistant id_carro', () => {
      let generatedRentalReserve: RentalReserve;
      let id_locadora: string;
      let idReserva: string;
      let user: string;
      beforeEach(async () => {
        const { data_inicio, data_fim, id_user } = await factory.build<RentalReserve>('RentalReserve');
        const generateFleet = await fleetFactory.create<RentalFleet>('RentalFleet');
        const fleetInfo = {
          id_carro: generateFleet._id?.toString() as string,
          id_locadora: generateFleet.id_locadora?.toString() as string
        };
        const { _id } = await factory.create<RentalReserve>('RentalReserve', {
          id_locadora: fleetInfo.id_locadora,
          id_user: id_user?.toString() as string
        });

        idReserva = _id?.toString() as string;
        user = id_user?.toString() as string;
        id_locadora = fleetInfo.id_locadora;
        generatedRentalReserve = {
          id_carro: fleetInfo.id_carro,
          data_fim: moment(data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
          data_inicio: moment(data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
        };
      });
      test('THEN should throw a not found error', async () => {
        try {
          await RentalReserveService.update(id_locadora as string, idReserva, generatedRentalReserve, {
            id: user,
            email: 'mail@mail.com',
            habilitado: 'sim'
          });
        } catch (e) {
          expect(e).toBeInstanceOf(NotFound);
          expect((<NotFound>e).description).toBe('Not Found');
          expect((<NotFound>e).message).toBe('Value id_carro: 6171508962f47a7a91938d30 not found');
        }
      });
    });

    describe('WHEN using nonexistant id_locadora', () => {
      let generatedRentalReserve: RentalReserve;
      let idReserva: string;
      let user: string;
      beforeEach(async () => {
        const { data_inicio, data_fim, id_user } = await factory.build<RentalReserve>('RentalReserve');
        const generateFleet = await fleetFactory.create<RentalFleet>('RentalFleet');
        const fleetInfo = {
          id_carro: generateFleet._id?.toString() as string,
          id_locadora: generateFleet.id_locadora?.toString() as string
        };
        const { _id } = await factory.create<RentalReserve>('RentalReserve', {
          id_locadora: fleetInfo.id_locadora,
          id_user: id_user?.toString() as string
        });

        idReserva = _id?.toString() as string;
        user = id_user?.toString() as string;
        generatedRentalReserve = {
          id_carro: fleetInfo.id_carro,
          data_fim: moment(data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
          data_inicio: moment(data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
        };
      });
      test('THEN should throw a not found error', async () => {
        try {
          await RentalReserveService.update('6171508962f47a7a91938d30', idReserva, generatedRentalReserve, {
            id: user,
            email: 'mail@mail.com',
            habilitado: 'sim'
          });
        } catch (e) {
          expect(e).toBeInstanceOf(NotFound);
          expect((<NotFound>e).description).toBe('Not Found');
          expect((<NotFound>e).message).toBe('Value id_locadora: 6171508962f47a7a91938d30 not found');
        }
      });
    });

    describe('WHEN trying to update a reserve that is due to next day', () => {
      let id_locadora: string;
      let idReserva: string;
      let user: string;
      let generatedRentalReserve: RentalReserve;
      beforeEach(async () => {
        const { data_inicio, data_fim, id_user } = await factory.build<RentalReserve>('RentalReserve');
        const generateFleet = await fleetFactory.create<RentalFleet>('RentalFleet');
        const fleetInfo = {
          id_carro: generateFleet._id?.toString() as string,
          id_locadora: generateFleet.id_locadora?.toString() as string
        };
        const { _id } = await factory.create<RentalReserve>('RentalReserve', {
          id_locadora: fleetInfo.id_locadora,
          id_user: id_user?.toString() as string,
          data_fim: moment().add(2, 'days').toDate(),
          data_inicio: moment().add(1, 'days').toDate()
        });
        idReserva = _id?.toString() as string;
        user = id_user?.toString() as string;
        id_locadora = fleetInfo.id_locadora;
        generatedRentalReserve = {
          id_carro: fleetInfo.id_carro,
          data_fim: moment(data_fim, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
          data_inicio: moment(data_inicio, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY')
        };
      });

      test('THEN should throw a invalid value', async () => {
        try {
          await RentalReserveService.update(id_locadora, idReserva, generatedRentalReserve, {
            id: user?.toString() as string,
            email: 'mail@mail.com',
            habilitado: 'sim'
          });
        } catch (e) {
          expect(e).toBeInstanceOf(InvalidValue);
          expect((<InvalidValue>e).description).toBe('Bad Request');
          expect((<InvalidValue>e).message).toBe(`Reserve is due to next day, is not allowed to update`);
        }
      });
    });
  });
});
