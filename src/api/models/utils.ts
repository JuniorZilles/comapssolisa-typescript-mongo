/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import mongoose from 'mongoose';

export default (id: string): boolean => mongoose.isValidObjectId(id);
