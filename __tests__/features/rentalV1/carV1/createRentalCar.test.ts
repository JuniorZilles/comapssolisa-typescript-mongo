import request from 'supertest';
import { RentalCar } from '@interfaces/rental/car/RentalCar';
import app from '../../../../src/app';
import factory from '../../../utils/factorys/RentalCarFactory';
import checkDefaultErrorFormat from '../../../utils/formats/ErrorFormat';
import { RENTALCARPREFIX, RENTALCARDATA } from '../../../utils/Constants';
import { checkDefaultRentalCarFormat } from '../../../utils/formats/RentalCarFormat';

describe('src :: api :: controllers :: rental :: car :: create', () => {});
