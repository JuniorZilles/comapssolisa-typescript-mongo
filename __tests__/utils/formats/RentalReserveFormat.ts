/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const checkDefaultRentalReserveFormat = (body): void => {
  expect(body).toEqual({
    _id: expect.any(String),
    data_inicio: expect.any(String),
    data_fim: expect.any(String),
    id_user: expect.any(String),
    id_carro: expect.any(String),
    id_locadora: expect.any(String),
    valor_final: expect.any(Number)
  });
};

export const checkDefaultRentalsReserveFormat = (body): void => {
  expect(body).toEqual({
    limit: expect.any(Number),
    offset: expect.any(Number),
    offsets: expect.any(Number),
    reservas: expect.arrayContaining([
      {
        _id: expect.any(String),
        data_inicio: expect.any(String),
        data_fim: expect.any(String),
        id_user: expect.any(String),
        id_carro: expect.any(String),
        id_locadora: expect.any(String),
        valor_final: expect.any(Number)
      }
    ]),
    total: expect.any(Number)
  });
};
