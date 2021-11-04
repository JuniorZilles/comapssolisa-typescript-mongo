import mongoose from 'mongoose';
import { Model } from './Model';

const RentalSchema = new mongoose.Schema({});

export default Model('Rental', RentalSchema);
