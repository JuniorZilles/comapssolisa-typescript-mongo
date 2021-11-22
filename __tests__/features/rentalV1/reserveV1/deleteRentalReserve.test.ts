import request from 'supertest';
import { RentalReserve } from '@interfaces/rental/reserve/RentalReserve';
import app from '../../../../src/app';
import factory from '../../../utils/factorys/RentalReserveFactory';
import checkDefaultErrorFormat from '../../../utils/formats/ErrorFormat';
import { RENTALFLEETPREFIX, RENTALFLEETDATA } from '../../../utils/Constants';
import { checkDefaultRentalReserveFormat } from '../../../utils/formats/RentalReserveFormat';

describe('src :: api :: controllers :: rental :: reserve :: delete', () => {});
