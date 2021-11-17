import request from 'supertest';
import Car from '@interfaces/Car';
import app from '../../../src/app';
import factory from '../../utils/factorys/CarFactory';
import checkDefaultErrorFormat from '../../utils/formats/ErrorFormat';
import { CARPREFIX, TOKEN } from '../../utils/Constants';
import { checkDefaultCarFormat } from '../../utils/formats/CarFormat';

describe('src :: api :: controllers :: car :: accessory :: patch', () => {
  test('should update a car accessory by its ID', async () => {
    const temp = await factory.create<Car>('Car');
    const response = await request(app)
      .patch(`${CARPREFIX}/${temp._id}/acessorios/${temp.acessorios[0]._id}`)
      .set(TOKEN)
      .send({ descricao: 'Ar-condicionado' });

    const { body } = response;

    expect(response.status).toBe(200);
    expect(body._id).toBe(temp._id?.toString());
    expect(body.ano).toBe(temp.ano);
    expect(body.cor).toBe(temp.cor);
    expect(body.modelo).toBe(temp.modelo);
    expect(body.__v).toBeUndefined();
    expect(body.quantidadePassageiros).toBe(temp.quantidadePassageiros);
    expect(body.acessorios.length).toEqual(temp.acessorios.length);
    expect(body.acessorios[0].descricao).toBe('Ar-condicionado');
    expect(body.acessorios[1].descricao).not.toBe('Ar-condicionado');
  });

  test('should return 400 when missing body', async () => {
    const temp = await factory.create<Car>('Car');
    const response = await request(app)
      .patch(`${CARPREFIX}/${temp._id}/acessorios/${temp.acessorios[0]._id}`)
      .set(TOKEN)
      .send({});

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body.length).toBeGreaterThanOrEqual(1);
    expect(body[0].description).toBe('descricao');
    expect(body[0].name).toBe('"descricao" is required');
  });

  test('should return 400 when white spaces on descricao', async () => {
    const temp = await factory.create<Car>('Car');
    const response = await request(app)
      .patch(`${CARPREFIX}/${temp._id}/acessorios/${temp.acessorios[0]._id}`)
      .set(TOKEN)
      .send({ descricao: '   ' });

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(1);
    expect(body[0].description).toBe('descricao');
    expect(body[0].name).toBe('"descricao" is not allowed to be empty');
  });

  test('should return 400 when invalid car ID on patch', async () => {
    const temp = await factory.create<Car>('Car');
    const response = await request(app)
      .patch(`${CARPREFIX}/125/acessorios/${temp.acessorios[0]._id}`)
      .set(TOKEN)
      .send({ descricao: 'vidro eletrico' });

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(2);
    expect(body[0].description).toBe('id');
    expect(body[0].name).toBe('"id" length must be 24 characters long');
  });

  test('should return 200 when invalid accessory description on patch', async () => {
    const temp = await factory.create<Car>('Car', {
      acessorios: [{ descricao: 'vidro eletrico' }, { descricao: 'Ar-condicionado' }]
    });
    const response = await request(app)
      .patch(`${CARPREFIX}/${temp._id}/acessorios/${temp.acessorios[0]._id}`)
      .set(TOKEN)
      .send({ descricao: 'vidro eletrico' });

    const { body } = response;

    expect(response.status).toBe(200);
    checkDefaultCarFormat(body);
    expect(body._id).toBe(temp._id?.toString());
    expect(body.ano).toBe(temp.ano);
    expect(body.cor).toBe(temp.cor);
    expect(body.modelo).toBe(temp.modelo);
    expect(body.__v).toBeUndefined();
    expect(body.quantidadePassageiros).toBe(temp.quantidadePassageiros);
    expect(body.acessorios.length).toEqual(temp.acessorios.length);
    expect(body.acessorios[0].descricao).toBe('vidro eletrico');
    expect(body.acessorios[0]._id).toBe(temp.acessorios[0]._id?.toString());
    expect(body.acessorios[1].descricao).toBe('Ar-condicionado');
    expect(body.acessorios[1]._id).toBe(temp.acessorios[1]._id?.toString());
  });

  test('should return 400 when invalid accessory ID on patch', async () => {
    const temp = await factory.create<Car>('Car');
    const response = await request(app)
      .patch(`${CARPREFIX}/${temp._id}/acessorios/789asd`)
      .set(TOKEN)
      .send({ descricao: 'vidro eletrico' });

    const { body } = response;

    expect(response.status).toBe(400);
    checkDefaultErrorFormat(body);
    expect(body).toHaveLength(2);
    expect(body[0].description).toBe('idAccessory');
    expect(body[0].name).toBe('"idAccessory" length must be 24 characters long');
  });
});
