/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const checkDefaultRentalFleetFormat = (body): void => {
  expect(body).toEqual({
    _id: expect.any(String),
    id_listagem: expect.any(String),
    id_locadora: expect.any(String)
  });
};

export const checkDefaultRentalsFleetFormat = (body): void => {
  expect(body).toEqual({
    limit: expect.any(Number),
    offset: expect.any(Number),
    offsets: expect.any(Number),
    reservas: expect.arrayContaining([
      {
        _id: expect.any(String),
        id_listagem: expect.any(String),
        id_locadora: expect.any(String)
      }
    ]),
    total: expect.any(Number)
  });
};
