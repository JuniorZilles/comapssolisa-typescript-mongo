import request from 'supertest';
import { Rental } from '@interfaces/rental/Rental';
import app from '../../../src/app';
import factory from '../../utils/factorys/RentalFactory';
import checkDefaultErrorFormat from '../../utils/formats/ErrorFormat';
import { RENTALPREFIX, RENTALDATA } from '../../utils/Constants';
import { checkDefaultRentalFormat } from '../../utils/formats/RentalFormat';

describe('src :: api :: controllers :: rental :: update', () => {
  test('Should update a rental place and return 200 with new database content', async () => {
    const tempData = await factory.create<Rental>('Rental');

    const response = await request(app).put(`${RENTALPREFIX}/${tempData._id}`).send(RENTALDATA);

    const { body } = response;

    expect(response.status).toBe(200);

    checkDefaultRentalFormat(body);
    expect(body.endereco.length).toEqual(RENTALDATA.endereco.length);
    expect(body.nome).toBe(RENTALDATA.nome);
    expect(body.cnpj).toBe(RENTALDATA.cnpj);
    expect(body.atividades).toBe(RENTALDATA.atividades);
    body.endereco.forEach((endereco, index) => {
      expect(endereco.cep).toBe(RENTALDATA.endereco[index].cep);
      expect(endereco.number).toBe(RENTALDATA.endereco[index].number);
      expect(endereco.isFilial).toBe(RENTALDATA.endereco[index].isFilial);
    });
  });

  test('should return 400 with errors if missing an attribute on update rental company', async () => {
    const rentalTemp = {
      cnpj: '16.670.085/0001-57',
      atividades: 'Aluguel de Carros E Gestão de Frotas',
      endereco: [
        {
          cep: '96200-200',
          number: '1234',
          isFilial: false
        }
      ]
    };
    const tempData = await factory.create<Rental>('Rental');

    const response = await request(app).put(`${RENTALPREFIX}/${tempData._id}`).send(rentalTemp);

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('nome');
    expect(body[0].name).toBe('"nome" is required');
  });

  test('should return 400 with errors if white space entry on update rental company', async () => {
    const rentalTemp = {
      nome: '   ',
      cnpj: '16.670.085/0001-55',
      atividades: 'Aluguel de Carros E Gestão de Frotas',
      endereco: [
        {
          cep: '96200-200',
          number: '1234',
          isFilial: false
        }
      ]
    };
    const tempData = await factory.create<Rental>('Rental');

    const response = await request(app).put(`${RENTALPREFIX}/${tempData._id}`).send(rentalTemp);

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('nome');
    expect(body[0].name).toBe('"nome" is not allowed to be empty');
  });

  test('should return 400 with errors if endereco has not any child on update rental company', async () => {
    const rentalTemp = {
      nome: 'Trevor Rental',
      cnpj: '16.670.085/0001-55',
      atividades: 'Aluguel de Carros E Gestão de Frotas',
      endereco: []
    };
    const tempData = await factory.create<Rental>('Rental');

    const response = await request(app).put(`${RENTALPREFIX}/${tempData._id}`).send(rentalTemp);

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('endereco');
    expect(body[0].name).toBe('"endereco" must contain at least 1 items');
  });

  test('should return 400 with errors if endereco has more than one headquarters on update rental company', async () => {
    const rentalTemp = {
      nome: 'Trevor Rental',
      cnpj: '16.670.085/0001-55',
      atividades: 'Aluguel de Carros E Gestão de Frotas',
      endereco: [
        {
          cep: '96200-200',
          number: '1234',
          isFilial: false
        },
        {
          cep: '96200-500',
          number: '124',
          isFilial: false
        }
      ]
    };
    const tempData = await factory.create<Rental>('Rental');

    const response = await request(app).put(`${RENTALPREFIX}/${tempData._id}`).send(rentalTemp);

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Bad Request');
    expect(body[0].name).toBe('isFilial has more than one headquarters');
  });

  test('should return 400 with errors if CNPJ already exists when updating a rental company', async () => {
    const rentalAuto = await factory.create<Rental>('Rental', {
      cnpj: '08.450.508/0001-01'
    });
    const rentalTemp = {
      nome: 'Trevor Rental',
      cnpj: rentalAuto.cnpj,
      atividades: 'Aluguel de Carros E Gestão de Frotas',
      endereco: [
        {
          cep: '96200-200',
          number: '1234',
          isFilial: false
        },
        {
          cep: '96200-500',
          number: '124',
          isFilial: true
        }
      ]
    };
    const tempData = await factory.create<Rental>('Rental');

    const response = await request(app).put(`${RENTALPREFIX}/${tempData._id}`).send(rentalTemp);

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Conflict');
    expect(body[0].name).toBe('CNPJ 08.450.508/0001-01 already in use');
  });

  test('should return 400 with errors if CNPJ has invalid format on updating a rental company', async () => {
    const rentalTemp = {
      nome: 'Trevor Rental',
      cnpj: '08.450.508/0001',
      atividades: 'Aluguel de Carros E Gestão de Frotas',
      endereco: [
        {
          cep: '96200-200',
          number: '1234',
          isFilial: false
        },
        {
          cep: '96200-500',
          number: '124',
          isFilial: true
        }
      ]
    };
    const tempData = await factory.create<Rental>('Rental');

    const response = await request(app).put(`${RENTALPREFIX}/${tempData._id}`).send(rentalTemp);

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('cnpj');
    expect(body[0].name).toBe('"cnpj" has a invalid format, it should be XX.XXX.XXX/XXXX-XX');
  });

  test('should return 400 with errors if CNPJ is invalid calculated value on updating a rental company', async () => {
    const rentalTemp = {
      nome: 'Trevor Rental',
      cnpj: '08.450.508/0001-78',
      atividades: 'Aluguel de Carros E Gestão de Frotas',
      endereco: [
        {
          cep: '96200-200',
          number: '1234',
          isFilial: false
        },
        {
          cep: '96200-500',
          number: '124',
          isFilial: true
        }
      ]
    };
    const tempData = await factory.create<Rental>('Rental');

    const response = await request(app).put(`${RENTALPREFIX}/${tempData._id}`).send(rentalTemp);

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Bad Request');
    expect(body[0].name).toBe('CNPJ 08.450.508/0001-78 is invalid');
  });

  test('should return 400 with errors if CEP has invalid format on updating a rental company', async () => {
    const rentalTemp = {
      nome: 'Trevor Rental',
      cnpj: '08.450.508/0001-01',
      atividades: 'Aluguel de Carros E Gestão de Frotas',
      endereco: [
        {
          cep: '96200',
          number: '1234',
          isFilial: false
        },
        {
          cep: '96200-500',
          number: '124',
          isFilial: true
        }
      ]
    };
    const tempData = await factory.create<Rental>('Rental');

    const response = await request(app).put(`${RENTALPREFIX}/${tempData._id}`).send(rentalTemp);

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('endereco.0.cep');
    expect(body[0].name).toBe('"cep" with incorrect format, it should be XXXXX-XXX');
  });

  test('should return 400 with errors if ID is invalid when updating a rental company', async () => {
    const response = await request(app).put(`${RENTALPREFIX}/12`);

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(2);
    expect(body[0].description).toBe('id');
    expect(body[0].name).toBe('"id" length must be 24 characters long');
  });

  test('should return 404 with error if ID is not found when updating a rental company', async () => {
    const rentalTemp = {
      nome: 'Trevor Rental',
      cnpj: '08.450.508/0001-01',
      atividades: 'Aluguel de Carros E Gestão de Frotas',
      endereco: [
        {
          cep: '96200-200',
          number: '1234',
          isFilial: false
        },
        {
          cep: '96200-500',
          number: '124',
          isFilial: true
        }
      ]
    };
    const response = await request(app).put(`${RENTALPREFIX}/6171508962f47a7a91938d30`).send(rentalTemp);

    const { body } = response;

    expect(response.status).toBe(404);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Not Found');
    expect(body[0].name).toBe('Value 6171508962f47a7a91938d30 not found');
  });
});
