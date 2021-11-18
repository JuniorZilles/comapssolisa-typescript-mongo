import request from 'supertest';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import app from '../../../../src/app';
import factory from '../../../utils/factorys/RentalFleetFactory';
import checkDefaultErrorFormat from '../../../utils/formats/ErrorFormat';
import { RENTALCARPREFIX, RENTALCARDATA } from '../../../utils/Constants';
import { checkDefaultRentalFleetFormat } from '../../../utils/formats/RentalFleetFormat';

describe('src :: api :: controllers :: rental :: car :: create', () => {
  test('GIVEN a new rental car WHEN every validation is meth THEN it should return status code 200', async () => {});
  test('GIVEN a new rental car WHEN every validation is meth THEN it should return the especified body', async () => {});
  test('GIVEN a new rental car WHEN every validation is meth THEN it should return have a id and match the content with the entry', async () => {});

  test('GIVEN a new rental car WHEN a field is missing THEN it should return status 400 for validation error', async () => {});
  test('GIVEN a new rental car WHEN a field is missing THEN it should return a body with the especified error format', async () => {});
  test('GIVEN a new rental car WHEN a field is missing THEN it should return a body with missing field error', async () => {});

  test('GIVEN a new rental car WHEN a field is empty THEN it should return status 400 for validation error', async () => {});
  test('GIVEN a new rental car WHEN a field is empty THEN it should return a body with the especified error format', async () => {});
  test('GIVEN a new rental car WHEN a field is empty THEN it should return a body with empty field error', async () => {});

  test('GIVEN a new rental car WHEN a plate is already used by another rental company THEN it should return status 400 for validation error', async () => {});
  test('GIVEN a new rental car WHEN a plate is already used by another rental company THEN it should return a body with the especified error format', async () => {});
  test('GIVEN a new rental car WHEN a plate is already used by another rental company THEN it should return a body with invalid plate error', async () => {});
});
