/* eslint-disable no-underscore-dangle */
import request from 'supertest';
import RentalModel from '@models/RentalModel';
import { Rental } from '@interfaces/Rental';
import factory from '../utils/RentalFactory';
import checkDefaultErrorFormat from '../utils/CheckErrorFormat';
import MongoDatabase from '../../src/infra/mongo/index';
import app from '../../src/app';

const PREFIX = '/api/v1/rental';
const rentalData = {
  nome: 'Localiza Rent a Car',
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
      number: '5678',
      complemento: 'Muro A',
      isFilial: true
    }
  ]
};

const checkDefaultRentalFormat = (body) => {
  expect(body).toEqual({
    _id: expect.any(String),
    atividades: expect.any(String),
    cnpj: expect.any(String),
    endereco: expect.arrayContaining([
      {
        _id: expect.any(String),
        bairro: expect.any(String),
        cep: expect.any(String),
        complemento: expect.any(String),
        isFilial: expect.any(Boolean),
        localidade: expect.any(String),
        logradouro: expect.any(String),
        number: expect.any(String),
        uf: expect.any(String)
      }
    ]),
    nome: expect.any(String)
  });
};

const checkDefaultRentalsFormat = (body) => {
  expect(body).toEqual({
    limit: expect.any(Number),
    locadoras: expect.arrayContaining([
      {
        _id: expect.any(String),
        atividades: expect.any(String),
        cnpj: expect.any(String),
        endereco: expect.arrayContaining([
          {
            _id: expect.any(String),
            bairro: expect.any(String),
            cep: expect.any(String),
            complemento: expect.any(String),
            isFilial: expect.any(Boolean),
            localidade: expect.any(String),
            logradouro: expect.any(String),
            number: expect.any(String),
            uf: expect.any(String)
          }
        ]),
        nome: expect.any(String)
      }
    ]),
    offset: expect.any(Number),
    offsets: expect.any(Number),
    total: expect.any(Number)
  });
};

describe('src :: api :: controllers :: rental', () => {
  beforeAll(async () => {
    await RentalModel.deleteMany();
  });
  afterAll(async () => {
    await MongoDatabase.disconect();
  });
  afterEach(async () => {
    await RentalModel.deleteMany();
  });

  /**
   * POST /rental
   */

  test('Should create a rental place and return 201 with database content', async () => {
    const response = await request(app).post(PREFIX).send(rentalData);

    const { body } = response;

    expect(response.status).toBe(201);

    checkDefaultRentalFormat(body);
    expect(body.endereco.length).toEqual(rentalData.endereco.length);
    expect(body.nome).toBe(rentalData.nome);
    expect(body.cnpj).toBe(rentalData.cnpj);
    expect(body.atividades).toBe(rentalData.atividades);
    body.endereco.forEach((endereco, index) => {
      expect(endereco.cep).toBe(rentalData.endereco[index].cep);
      expect(endereco.number).toBe(rentalData.endereco[index].number);
      expect(endereco.isFilial).toBe(rentalData.endereco[index].isFilial);
    });
  });

  test('should return 400 with errors if missing an attribute on create rental', async () => {
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
    const response = await request(app).post(PREFIX).send(rentalTemp);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('nome');
    expect(body[0].name).toBe('"nome" is required');
  });

  test('should return 400 with errors if white space entry on create rental', async () => {
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
    const response = await request(app).post(PREFIX).send(rentalTemp);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('nome');
    expect(body[0].name).toBe('"nome" is not allowed to be empty');
  });

  test('should return 400 with errors if endereco has not any child on create rental', async () => {
    const rentalTemp = {
      nome: 'Trevor Rental',
      cnpj: '16.670.085/0001-55',
      atividades: 'Aluguel de Carros E Gestão de Frotas',
      endereco: []
    };
    const response = await request(app).post(PREFIX).send(rentalTemp);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('endereco');
    expect(body[0].name).toBe('"endereco" must contain at least 1 items');
  });

  test('should return 400 with errors if endereco has more than one headquarters on create rental', async () => {
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
    const response = await request(app).post(PREFIX).send(rentalTemp);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Bad Request');
    expect(body[0].name).toBe('isFilial has more than one headquarters');
  });

  test('should return 400 with errors if CNPJ already exists on create rental', async () => {
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
    const response = await request(app).post(PREFIX).send(rentalTemp);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Conflict');
    expect(body[0].name).toBe('CNPJ 08.450.508/0001-01 already in use');
  });

  test('should return 400 with errors if CNPJ has invalid format on create rental', async () => {
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
    const response = await request(app).post(PREFIX).send(rentalTemp);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('cnpj');
    expect(body[0].name).toBe('"cnpj" has a invalid format');
  });

  test('should return 400 with errors if CNPJ is invalid calculated value on create rental', async () => {
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
    const response = await request(app).post(PREFIX).send(rentalTemp);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Bad Request');
    expect(body[0].name).toBe('CNPJ 08.450.508/0001-78 is invalid');
  });

  test('should return 400 with errors if CEP has invalid format on create rental', async () => {
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
    const response = await request(app).post(PREFIX).send(rentalTemp);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('endereco.0.cep');
    expect(body[0].name).toBe('"cep" with incorrect format, it should be XXXXX-XXX');
  });

  /**
   * GET BY ID
   */

  test('should get a rental company by ID', async () => {
    const tempData = await factory.create<Rental>('Rental');

    const response = await request(app).get(`${PREFIX}/${tempData._id}`);

    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultRentalFormat(body);
    expect(body.endereco.length).toEqual(tempData.endereco.length);
    expect(body.nome).toBe(tempData.nome);
    expect(body.cnpj).toBe(tempData.cnpj);
    expect(body.atividades).toBe(tempData.atividades);
    body.endereco.forEach((endereco, index) => {
      expect(endereco.cep).toBe(tempData.endereco[index].cep);
      expect(endereco.number).toBe(tempData.endereco[index].number);
      expect(endereco.isFilial).toBe(tempData.endereco[index].isFilial);
    });
  });

  test('should return 400 with errors if ID is invalid when searching', async () => {
    const response = await request(app).get(`${PREFIX}/12`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(2);
    expect(body[0].description).toBe('id');
    expect(body[0].name).toBe('"id" length must be 24 characters long');
  });

  test('should return 404 with error if ID is not found when searching', async () => {
    const response = await request(app).get(`${PREFIX}/6171508962f47a7a91938d30`);
    const { body } = response;

    expect(response.status).toBe(404);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Not Found');
    expect(body[0].name).toBe('Value 6171508962f47a7a91938d30 not found');
  });

  /**
   * DELETE BY ID
   */

  test("should remove a rental company by it's ID", async () => {
    const tempData = await factory.create<Rental>('Rental');

    const response = await request(app).delete(`${PREFIX}/${tempData._id}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

  test('should return 400 with errors if ID is invalid when removing', async () => {
    const response = await request(app).delete(`${PREFIX}/12`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(2);
    expect(body[0].description).toBe('id');
    expect(body[0].name).toBe('"id" length must be 24 characters long');
  });

  test('should return 404 with error if ID is not found when removing', async () => {
    const response = await request(app).delete(`${PREFIX}/6171508962f47a7a91938d30`);
    const { body } = response;

    expect(response.status).toBe(404);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Not Found');
    expect(body[0].name).toBe('Value 6171508962f47a7a91938d30 not found');
  });

  /**
   * PUT BY ID
   */

  test('Should update a rental place and return 200 with new database content', async () => {
    const tempData = await factory.create<Rental>('Rental');

    const response = await request(app).put(`${PREFIX}/${tempData._id}`).send(rentalData);

    const { body } = response;

    expect(response.status).toBe(200);

    checkDefaultRentalFormat(body);
    expect(body.endereco.length).toEqual(rentalData.endereco.length);
    expect(body.nome).toBe(rentalData.nome);
    expect(body.cnpj).toBe(rentalData.cnpj);
    expect(body.atividades).toBe(rentalData.atividades);
    body.endereco.forEach((endereco, index) => {
      expect(endereco.cep).toBe(rentalData.endereco[index].cep);
      expect(endereco.number).toBe(rentalData.endereco[index].number);
      expect(endereco.isFilial).toBe(rentalData.endereco[index].isFilial);
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

    const response = await request(app).put(`${PREFIX}/${tempData._id}`).send(rentalTemp);

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

    const response = await request(app).put(`${PREFIX}/${tempData._id}`).send(rentalTemp);

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

    const response = await request(app).put(`${PREFIX}/${tempData._id}`).send(rentalTemp);

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

    const response = await request(app).put(`${PREFIX}/${tempData._id}`).send(rentalTemp);

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

    const response = await request(app).put(`${PREFIX}/${tempData._id}`).send(rentalTemp);

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

    const response = await request(app).put(`${PREFIX}/${tempData._id}`).send(rentalTemp);

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('cnpj');
    expect(body[0].name).toBe('"cnpj" has a invalid format');
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

    const response = await request(app).put(`${PREFIX}/${tempData._id}`).send(rentalTemp);

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

    const response = await request(app).put(`${PREFIX}/${tempData._id}`).send(rentalTemp);

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('endereco.0.cep');
    expect(body[0].name).toBe('"cep" with incorrect format, it should be XXXXX-XXX');
  });

  test('should return 400 with errors if ID is invalid when updating a rental company', async () => {
    const response = await request(app).put(`${PREFIX}/12`);

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
    const response = await request(app).put(`${PREFIX}/6171508962f47a7a91938d30`).send(rentalTemp);

    const { body } = response;

    expect(response.status).toBe(404);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('Not Found');
    expect(body[0].name).toBe('Value 6171508962f47a7a91938d30 not found');
  });

  /**
   * GET LIST
   */

  test('should get 5 each rental companys with pagination', async () => {
    await factory.createMany<Rental>('Rental', 25);

    const responseP0 = await request(app).get(`${PREFIX}?offset=0&limit=5`);
    const rentalP0 = responseP0.body;

    expect(responseP0.status).toBe(200);
    checkDefaultRentalsFormat(rentalP0);
    expect(rentalP0.locadoras.length).toEqual(5);
    expect(rentalP0.offset).toEqual(1);
    expect(rentalP0.limit).toEqual(5);
    expect(rentalP0.total).toEqual(25);
    expect(rentalP0.offsets).toEqual(5);

    const responseP1 = await request(app).get(`${PREFIX}?offset=1&limit=5`);
    const rentalP1 = responseP1.body;
    expect(responseP1.status).toBe(200);
    checkDefaultRentalsFormat(rentalP1);
    expect(rentalP1.locadoras.length).toEqual(5);
    expect(rentalP1.offset).toEqual(1);
    expect(rentalP1.limit).toEqual(5);
    expect(rentalP1.total).toEqual(25);
    expect(rentalP1.offsets).toEqual(5);
  });

  test('should get all rental company that by nome', async () => {
    const locadora = await factory.create<Rental>('Rental', {
      nome: 'Trevor Rental'
    });
    await factory.createMany<Rental>('Rental', 5);

    const response = await request(app).get(`${PREFIX}?offset=0&limit=10&nome=Trevor Rental`);
    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultRentalsFormat(body);
    expect(body.locadoras.length).toEqual(1);
    expect(body.locadoras[0].__v).toBeUndefined();
    expect(body.locadoras[0]._id).toBe(locadora._id?.toString());
    expect(body.locadoras[0].atividades).toBe(locadora.atividades);
    expect(body.locadoras[0].cnpj).toBe(locadora.cnpj);
    expect(body.locadoras[0].nome).toBe(locadora.nome);
    expect(body.locadoras[0].endereco.length).toEqual(locadora.endereco.length);
  });

  test('should get all rental company that by bairro', async () => {
    const locadora = await factory.create<Rental>('Rental', {
      endereco: [
        {
          cep: '96200-200',
          logradouro: 'Rua General Canabarro',
          complemento: '',
          bairro: 'Centro',
          number: '1234',
          localidade: 'Rio Grande',
          uf: 'SP',
          isFilial: false
        }
      ]
    });
    await factory.createMany<Rental>('Rental', 5);

    const response = await request(app).get(`${PREFIX}?offset=0&limit=10&bairro=Centro`);
    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultRentalsFormat(body);
    expect(body.locadoras.length).toEqual(1);
    expect(body.locadoras[0].__v).toBeUndefined();
    expect(body.locadoras[0]._id).toBe(locadora._id?.toString());
    expect(body.locadoras[0].atividades).toBe(locadora.atividades);
    expect(body.locadoras[0].cnpj).toBe(locadora.cnpj);
    expect(body.locadoras[0].nome).toBe(locadora.nome);
    expect(body.locadoras[0].endereco.length).toEqual(locadora.endereco.length);
  });

  test('should not get any rental company', async () => {
    const response = await request(app).get(`${PREFIX}?offset=0&limit=10&nome=Trevor Rental`);
    const { body } = response;

    expect(response.status).toBe(200);
    expect(body).toEqual({
      locadoras: expect.any(Array),
      total: expect.any(Number),
      limit: expect.any(Number),
      offset: expect.any(Number),
      offsets: expect.any(Number)
    });
    expect(body.locadoras.length).toEqual(0);
  });

  test('should not get any rental company when inputed CNPJ is invalid', async () => {
    const response = await request(app).get(`${PREFIX}?offset=0&limit=10&cnpj=16670085000155`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('cnpj');
    expect(body[0].name).toBe('"cnpj" has a invalid format');
  });

  test('should not get any rental company when inputed CEP is invalid', async () => {
    const response = await request(app).get(`${PREFIX}?offset=0&limit=10&cep=15678911`);
    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('cep');
    expect(body[0].name).toBe('"cep" with incorrect format, it should be XXXXX-XXX');
  });
});
