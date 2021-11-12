/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export default (body): void => {
  expect(body).toEqual(
    expect.arrayContaining([
      {
        name: expect.any(String),
        description: expect.any(String)
      }
    ])
  );
};
