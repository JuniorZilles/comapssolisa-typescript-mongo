import request from 'supertest';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import app from '../../../../src/app';
import factory from '../../../utils/factorys/RentalFleetFactory';
import checkDefaultErrorFormat from '../../../utils/formats/ErrorFormat';
import { RENTALCARPREFIX } from '../../../utils/Constants';

describe('src :: api :: controllers :: rental :: car :: getAll', () => {
  test('GIVEN 15 existing rental car WHEN searched with empty query params THEN it should return status code 200', async () => {});
  test('GIVEN 15 existing rental car WHEN searched with empty query params THEN it should match de defined body format', async () => {});
  test('GIVEN 15 existing rental car WHEN searched with empty query params THEN it should return all the 15 existing registers', async () => {});

  test('GIVEN 15 existing rental car WHEN searched passing limit=5 param THEN it should return status code 200', async () => {});
  test('GIVEN 15 existing rental car WHEN searched passing limit=5 param THEN it should match de defined body format', async () => {});
  test('GIVEN 15 existing rental car WHEN searched passing limit=5 param THEN it should return just 5 of the 15 existing registers', async () => {});

  test('GIVEN 15 existing rental car WHEN searched passing limit=5 param THEN it should return status code 200', async () => {});
  test('GIVEN 15 existing rental car WHEN searched passing limit=5 param THEN it should match de defined body format', async () => {});
  test('GIVEN 15 existing rental car WHEN searched passing limit=5 param THEN it should return just 5 of the 15 existing registers', async () => {});
});
