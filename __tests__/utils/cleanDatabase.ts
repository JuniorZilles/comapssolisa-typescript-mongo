import mongoose from 'mongoose';

export default async (): Promise<void> => {
  const collecttions = Object.keys(mongoose.connection.collections);
  await Promise.all(
    collecttions.map(async (collection) => {
      await mongoose.connection.collections[collection].deleteMany({});
    })
  );
};
