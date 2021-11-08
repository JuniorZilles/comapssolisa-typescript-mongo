/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import mongoose from 'mongoose';

export const Model = (name: string, schema: mongoose.Schema) => mongoose.model(name, schema);

export const isValid = (id: string): boolean => mongoose.isValidObjectId(id);
