import request from 'supertest';
import { RentalCar } from '@interfaces/rental/car/RentalCar';
import app from '../../../../src/app';
import factory from '../../../utils/factorys/RentalCarFactory';
import checkDefaultErrorFormat from '../../../utils/formats/ErrorFormat';
import { RENTALCARPREFIX } from '../../../utils/Constants';

describe('src :: api :: controllers :: rental :: car :: delete', () => {
  test('GIVEN a existing rental car WHEN the passed IDs are valid THEN it should return status code 204', async () => {});
  test('GIVEN a existing rental car WHEN the passed IDs are valid THEN it should not have a body', async () => {});
  test('GIVEN a existing rental car WHEN the passed IDs are valid THEN it should not find the register when searching by its ID', async () => {});

  test('GIVEN a existing rental car WHEN the passed a invalid car ID THEN it should return status code 400', async () => {});
  test('GIVEN a existing rental car WHEN the passed a invalid car ID THEN it should return a body with the especified error format', async () => {});
  test('GIVEN a existing rental car WHEN the passed a invalid car ID THEN it should return a body with invalid car ID error', async () => {});

  test('GIVEN a existing rental car WHEN the passed a invalid rental ID THEN it should return status code 400', async () => {});
  test('GIVEN a existing rental car WHEN the passed a invalid rental ID THEN it should return a body with the especified error format', async () => {});
  test('GIVEN a existing rental car WHEN the passed a invalid rental ID THEN it should return a body with invalid rental ID error', async () => {});

  test('GIVEN a existing rental car WHEN the passed rental ID id nonexistent THEN it should return status code 404', async () => {});
  test('GIVEN a existing rental car WHEN the passed rental ID id nonexistent ID THEN it should return a body with the especified error format', async () => {});
  test('GIVEN a existing rental car WHEN the passed rental ID id nonexistent ID THEN it should return a body with not found rental ID error', async () => {});

  test('GIVEN a existing rental car WHEN the passed car ID id nonexistent THEN it should return status code 404', async () => {});
  test('GIVEN a existing rental car WHEN the passed car ID id nonexistent ID THEN it should return a body with the especified error format', async () => {});
  test('GIVEN a existing rental car WHEN the passed car ID id nonexistent ID THEN it should return a body with not found rental ID error', async () => {});
});
