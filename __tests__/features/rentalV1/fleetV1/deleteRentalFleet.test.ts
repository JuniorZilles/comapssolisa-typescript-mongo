import request from 'supertest';
import { RentalFleet } from '@interfaces/rental/fleet/RentalFleet';
import app from '../../../../src/app';
import factory from '../../../utils/factorys/RentalFleetFactory';
import checkDefaultErrorFormat from '../../../utils/formats/ErrorFormat';
import { RENTALFLEETPREFIX, RENTALFLEETDATA } from '../../../utils/Constants';
import { checkDefaultRentalFleetFormat } from '../../../utils/formats/RentalFleetFormat';

describe('src :: api :: controllers :: rental :: fleet :: delete', () => {});
